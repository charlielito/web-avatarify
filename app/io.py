from io import BytesIO

import cv2
import imageio
import numpy as np
import PIL
from skimage import img_as_ubyte

import tensorflow as tf


def read_fn(filepath):
    with tf.io.gfile.GFile(filepath, "rb") as f:
        return f.read()


def read_image(filepath, **read_kwargs):

    buf = read_fn(filepath)
    buf = np.frombuffer(buf, np.uint8)

    arr = cv2.imdecode(buf, cv2.IMREAD_UNCHANGED)
    if arr.ndim == 3:
        if arr.shape[-1] == 3:
            arr = cv2.cvtColor(arr, cv2.COLOR_BGR2RGB)
        else:
            arr = cv2.cvtColor(arr, cv2.COLOR_BGRA2RGBA)

    return arr


def bytes2image(image_bytes):
    with BytesIO(image_bytes) as image_bytes:
        image = PIL.Image.open(image_bytes)
        image = np.array(image, copy=True)

    return image


def image2bytes(image: np.ndarray, image_format: str = "jpeg", **save_kwargs) -> bytes:
    image = PIL.Image.fromarray(image)
    with BytesIO() as image_bytes:
        image.save(image_bytes, format=image_format, **save_kwargs)
        encoded_bytes = image_bytes.getvalue()
    return encoded_bytes


def get_frames_from_camera(camera_id):
    video_frames = []
    start_recording = False
    cap = cv2.VideoCapture(camera_id)

    # Capture initial video
    while True:
        grabbed, frame = cap.read()
        if not grabbed:
            break
        frame = frame[..., ::-1].copy()

        if start_recording:
            video_frames.append(frame.copy())
            cv2.putText(
                frame,
                "Recording",
                (20, 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (209, 80, 0),
                3,
            )

        cv2.imshow("original", frame[..., ::-1])

        key = cv2.waitKey(1)

        if key == 27:  # ESC
            break
        elif key == ord("s"):
            start_recording = not start_recording

    cap.release()
    cv2.destroyAllWindows()
    return video_frames


def write_video(video_path, video_frames, fps=30):
    imageio.mimsave(
        video_path, [img_as_ubyte(frame) for frame in video_frames], fps=fps
    )


def bytes2video(videobytes):
    with imageio.get_reader(videobytes, "ffmpeg") as reader:
        for image in reader:
            yield image
