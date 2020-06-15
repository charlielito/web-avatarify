from python_path import PythonPath
import cv2

with PythonPath("."):
    from afy.predictor_local import PredictorLocal
    from app.io import (
        read_image,
        image2bytes,
        get_frames_from_camera,
        write_video,
        read_fn,
        bytes2video,
        get_audio_obj,
    )
    import app.model_funs as model_funs


config_path = "fomm/config/vox-adv-256.yaml"
checkpoint_path = "vox-adv-cpk.pth.tar"

model = PredictorLocal(config_path, checkpoint_path, adapt_movement_scale=True)
IMG_SIZE = 256
size = (IMG_SIZE, IMG_SIZE)


avatar = cv2.imread("avatars/jobs.jpg")[..., ::-1]
avatar = cv2.imread("avatars/mona.jpg")[..., ::-1]
avatar = cv2.resize(avatar, size)
model.set_source_image(avatar)

video_path = "test.webm"
video_frames = list(bytes2video(read_fn(video_path)))
bbox = model.get_face_bbox(video_frames[0])

output_frames = model_funs.generate_video(
    model,
    video_frames,
    merge=False,
    verbose=True,
    horizontal_flip=True,
    relative=True,
    crop_bbox=bbox,
    debug=True,
)
