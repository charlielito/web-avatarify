import cv2
import numpy as np
from python_path import PythonPath
from tqdm import tqdm

with PythonPath("."):
    from afy.utils import crop, pad_img

from . import io


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
    watermark="app/watermark.png",
    debug=False,
):
    output = []
    stream_img_size = None
    video_frames = (
        tqdm(video_frames, total=len(video_frames)) if verbose else video_frames
    )

    # load watermark image
    if watermark is not None:
        watermark = io.read_image(watermark)

    for frame in video_frames:

        if crop_bbox:
            x1, y1, x2, y2 = crop_bbox
            frame = frame[y1:y2, x1:x2]

        if horizontal_flip:
            frame = cv2.flip(frame, 1)

        if stream_img_size is None:
            stream_img_size = frame.shape[1], frame.shape[0]

        input_frame = cv2.resize(frame, model_input_size)

        out = model.predict(input_frame, relative=relative)
        out = pad_img(out, stream_img_size)
        out = cv2.resize(out, stream_img_size)

        if merge:
            out = np.concatenate([frame, out], axis=axis)

        if watermark is not None:
            # Add watermark
            out_h, out_w = out.shape[:2]
            wm_h, wm_w = watermark.shape[:2]

            final_h = out_h * 0.2
            final_watermark = cv2.resize(
                watermark, fx=final_h / wm_h, fy=final_h / wm_h, dsize=None
            )
            x = out_w - int(final_h / wm_h * wm_w)
            y = out_h - int(final_h)

            # put watermark in center
            if merge:
                x = out_w // 2 - int(final_h / wm_h * wm_w) // 2

            out = io.overlay(out, final_watermark, x, y)

        if debug:
            cv2.imshow("Otuput", out)
            cv2.imshow("Model input", input_frame)
            cv2.waitKey(1)

        output.append(out)

    print(out.shape)

    return output
