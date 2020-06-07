import base64
import json
import os
import time
import typing
import uuid
from pathlib import Path

import cv2
import numpy as np
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from moviepy.editor import VideoClip
from pydantic import BaseModel

from afy.predictor_local import PredictorLocal
from app import io, model_funs, security, types

config_path = "fomm/config/vox-adv-256.yaml"
checkpoint_path = "vox-adv-cpk.pth.tar"
model_input_size = (256, 256)
model = PredictorLocal(
    config_path,
    checkpoint_path,
    relative=True,
    adapt_movement_scale=True,
    # device=os.getenv("DEVICE"),
)

router = APIRouter()


class Request(BaseModel):
    avatar: types.Image
    video: types.Video
    merge: bool = False
    axis: int = 1


class Response(BaseModel):
    video: types.Video


def handle_image_request(image: types.Image):
    if image.content is None and image.source is None:
        raise HTTPException(
            status_code=400,
            detail="Either image as bytes or image source with uri needs to be sent!",
        )

    try:
        init = time.time()
        if image.content is not None:
            image_bytes = image.content
            image = io.bytes2image(base64.b64decode(image_bytes))
        else:
            image_bytes = io.read_fn(image.source.imageUri)
            image = io.bytes2image(image_bytes)
            image_bytes = base64.b64encode(image_bytes)
        print(f"Elapsed reading image: {time.time()-init}")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Image {} could not be read. Error: {}".format(
                image.source.imageUri, e
            ),
        )

    return image, image_bytes


@router.post("")
def run_inference(
    request: Request,
    credentials: HTTPAuthorizationCredentials = security.http_credentials,
):
    avatar, _ = handle_image_request(request.avatar)
    avatar = cv2.resize(avatar, model_input_size)
    if avatar.ndim == 2:
        avatar = np.tile(avatar[..., None], [1, 1, 3])

    model.set_source_image(avatar)

    video_bytes = base64.b64decode(request.video.content)
    video_frames = list(io.bytes2video(video_bytes))
    print(len(video_frames))

    audio = io.get_audio_obj(video_bytes)

    output_frames = model_funs.generate_video(
        model,
        video_frames,
        merge=request.merge,
        axis=request.axis,
        verbose=True,
        model_input_size=model_input_size,
    )

    fps = 30.0
    video = VideoClip(
        lambda t: output_frames[int(t * fps)], duration=len(video_frames) / fps
    )
    video = video.set_audio(audio.set_duration(video.duration))

    path = f"app/static/{uuid.uuid4().hex}.mp4"

    video.write_videofile(path, fps=fps)

    # output_frames = video_frames
    # io.write_video(path, output_frames)

    video_bytes = io.read_fn(path)
    result = base64.b64encode(video_bytes).decode()

    return Response(video=types.Video(content=result))
