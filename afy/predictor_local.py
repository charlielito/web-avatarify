import face_alignment
import numpy as np
import torch
import yaml
from scipy.spatial import ConvexHull
from python_path import PythonPath

with PythonPath("./fomm"):
    from animate import normalize_kp
    from modules.generator_optim import OcclusionAwareGenerator
    from modules.keypoint_detector import KPDetector
    from sync_batchnorm import DataParallelWithCallback


def to_tensor(a):
    return torch.tensor(a[np.newaxis].astype(np.float32)).permute(0, 3, 1, 2) / 255


class PredictorLocal:
    def __init__(
        self,
        config_path,
        checkpoint_path,
        adapt_movement_scale=False,
        device=None,
        enc_downscale=1,
    ):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.adapt_movement_scale = adapt_movement_scale
        self.start_frame = None
        self.start_frame_kp = None
        self.kp_driving_initial = None
        self.config_path = config_path
        self.checkpoint_path = checkpoint_path
        self.generator, self.kp_detector = None, None
        self.fa = None, None
        self.source = None
        self.kp_source = None
        self.enc_downscale = enc_downscale

    def load_checkpoints(self):
        with open(self.config_path) as f:
            config = yaml.safe_load(f)

        generator = OcclusionAwareGenerator(
            **config["model_params"]["generator_params"],
            **config["model_params"]["common_params"]
        )
        generator.to(self.device)

        kp_detector = KPDetector(
            **config["model_params"]["kp_detector_params"],
            **config["model_params"]["common_params"]
        )
        kp_detector.to(self.device)

        checkpoint = torch.load(self.checkpoint_path, map_location=self.device)
        generator.load_state_dict(checkpoint["generator"])
        kp_detector.load_state_dict(checkpoint["kp_detector"])

        generator.eval()
        kp_detector.eval()

        return generator, kp_detector

    def reset_frames(self):
        self.kp_driving_initial = None

    def load_models(self):
        print("******* Loading models.... ********")
        self.generator, self.kp_detector = self.load_checkpoints()
        self.fa = face_alignment.FaceAlignment(
            face_alignment.LandmarksType._2D, flip_input=True, device=self.device
        )

    def set_source_image(self, source_image):
        if self.generator is None:
            self.load_models()

        self.source = to_tensor(source_image).to(self.device)
        self.kp_source = self.kp_detector(self.source)

        if self.enc_downscale > 1:
            h, w = (
                int(self.source.shape[2] / self.enc_downscale),
                int(self.source.shape[3] / self.enc_downscale),
            )
            source_enc = torch.nn.functional.interpolate(
                self.source, size=(h, w), mode="bilinear"
            )
        else:
            source_enc = self.source

        self.generator.encode_source(source_enc)

    def predict(self, driving_frame, relative=False):
        with torch.no_grad():
            driving = to_tensor(driving_frame).to(self.device)

            if self.kp_driving_initial is None:
                self.kp_driving_initial = self.kp_detector(driving)
                self.start_frame = driving_frame.copy()
                self.start_frame_kp = self.get_frame_kp(driving_frame)

            kp_driving = self.kp_detector(driving)
            kp_norm = normalize_kp(
                kp_source=self.kp_source,
                kp_driving=kp_driving,
                kp_driving_initial=self.kp_driving_initial,
                use_relative_movement=relative,
                use_relative_jacobian=relative,
                adapt_movement_scale=self.adapt_movement_scale,
            )

            out = self.generator(
                self.source, kp_source=self.kp_source, kp_driving=kp_norm
            )

            out = np.transpose(out["prediction"].data.cpu().numpy(), [0, 2, 3, 1])[0]
            out = (np.clip(out, 0, 1) * 255).astype(np.uint8)

            return out

    def get_frame_kp(self, image):
        kp_landmarks = self.fa.get_landmarks(image)
        if kp_landmarks:
            kp_image = kp_landmarks[0]
            kp_image = self.normalize_alignment_kp(kp_image)
            return kp_image
        else:
            return None

    @staticmethod
    def normalize_alignment_kp(kp):
        kp = kp - kp.mean(axis=0, keepdims=True)
        area = ConvexHull(kp[:, :2]).volume
        area = np.sqrt(area)
        kp[:, :2] = kp[:, :2] / area
        return kp

    def get_start_frame(self):
        return self.start_frame

    def get_start_frame_kp(self):
        return self.start_frame_kp

    @staticmethod
    def get_max_length(bbox):
        x1, y1, x2, y2 = bbox
        w = x2 - x1
        h = y2 - y1
        square_length = max(w, h)
        return square_length

    def get_face_bbox(self, image, growth_factor=0.4):
        bboxes = self.fa.face_detector.detect_from_image(image)
        if not bboxes:
            return []

        img_h, img_w = image.shape[:2]

        bbox = list(map(int, bboxes[0]))
        x1, y1, x2, y2, score = bbox
        square_length = self.get_max_length((x1, y1, x2, y2))
        dlength = int(growth_factor * square_length)

        x1 = max(0, x1 - dlength)
        y1 = max(0, y1 - dlength)
        x2 = min(img_w - 1, x2 + dlength)
        y2 = min(img_h - 1, y2 + int(dlength * 0.5))

        output_length = self.get_max_length((x1, y1, x2, y2))

        # make it even
        if output_length % 2 != 0:
            output_length -= 1

        return (x1, y1, x1 + output_length, y1 + output_length)
