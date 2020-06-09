import cv2
import numpy as np
from python_path import PythonPath
from tqdm import tqdm

with PythonPath("."):
    from afy.utils import crop, pad_img


def generate_video(
    model,
    video_frames,
    merge=False,
    axis=1,
    verbose=True,
    horizontal_flip=False,
    relative=False,
    model_input_size=(256, 256),
    crop_bbox=[],
):
    output = []
    stream_img_size = None
    video_frames = (
        tqdm(video_frames, total=len(video_frames)) if verbose else video_frames
    )
    for frame in video_frames:

        if crop_bbox:
            x1, y1, x2, y2 = crop_bbox
            frame = frame[y1:y2, x1:x2]

        if horizontal_flip:
            frame = cv2.flip(frame, 1)

        if stream_img_size is None:
            stream_img_size = frame.shape[1], frame.shape[0]

        # input_frame, lrudwh = crop(
        #     frame, p=frame_proportion, offset_x=frame_offset_x, offset_y=frame_offset_y,
        # )
        input_frame = cv2.resize(frame, model_input_size)

        out = model.predict(input_frame, relative=relative)
        out = pad_img(out, stream_img_size)
        out = cv2.resize(out, stream_img_size)

        if merge:
            out = np.concatenate([frame, out], axis=axis)
        output.append(out)

    return output
