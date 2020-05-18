import cv2
import numpy as np
from python_path import PythonPath
from tqdm import tqdm

with PythonPath("."):
    from afy.predictor_local import PredictorLocal
    from afy.utils import Once, log, crop, pad_img, resize, TicToc
    from afy.utils import load_stylegan_avatar


config_path = "fomm/config/vox-adv-256.yaml"
checkpoint_path = "vox-adv-cpk.pth.tar"

model = PredictorLocal(
    config_path, checkpoint_path, relative=True, adapt_movement_scale=True
)

IMG_SIZE = 256
size = (IMG_SIZE, IMG_SIZE)

frame_proportion = 0.9
frame_offset_x = 0
frame_offset_y = 0
stream_img_size = None

cap = cv2.VideoCapture(0)

avatar = cv2.imread("avatars/apipe.jpg")[..., ::-1]
avatar = cv2.resize(avatar, size)

video_frames = []
start_recording = False
# Capture initial video
while True:
    grabbed, frame = cap.read()
    if not grabbed:
        break
    frame = frame[..., ::-1].copy()

    if start_recording:
        video_frames.append(frame.copy())
        cv2.putText(
            frame, "Recording", (20, 20), cv2.FONT_HERSHEY_SIMPLEX, 1, (209, 80, 0), 3,
        )

    cv2.imshow("original", frame[..., ::-1])

    key = cv2.waitKey(1)

    if key == 27:  # ESC
        break
    elif key == ord("s"):
        start_recording = not start_recording

cap.release()

model.set_source_image(avatar)
output = []
merge = True
# merge = False
for frame in tqdm(video_frames, total=len(video_frames)):

    if stream_img_size is None:
        stream_img_size = frame.shape[1], frame.shape[0]

        video_img_size = (
            frame.shape[1] * 2 if merge else frame.shape[1],
            frame.shape[0],
        )
        video_writer = cv2.VideoWriter(
            "out.mp4", cv2.VideoWriter_fourcc(*"MP4V"), 30, video_img_size,
        )

    input_frame, lrudwh = crop(
        frame, p=frame_proportion, offset_x=frame_offset_x, offset_y=frame_offset_y,
    )
    input_frame = cv2.resize(input_frame, size)

    out = model.predict(input_frame)
    out = pad_img(out, stream_img_size)
    out = cv2.resize(out, stream_img_size)

    output.append(out)

    if merge:
        out = np.concatenate([frame, out], axis=1)
    video_writer.write(out[..., ::-1])

video_writer.release()
for frame, out in zip(video_frames, output):
    cv2.imshow("original", frame[..., ::-1])
    cv2.imshow("deepfake", out[..., ::-1])
    cv2.waitKey(1)
