import base64
import json
import os
import time
import typing
import uuid
from pathlib import Path

import cv2
import numpy as np
import requests
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel

from app import io, security, types

router = APIRouter()
server_url = os.getenv("SERVER_URL")
api_token = os.getenv("API_TOKEN")

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_token}",
}


class Request(BaseModel):
    avatar: types.Image
    video: types.Video
    merge: bool = False
    axis: int = 1


class Response(BaseModel):
    video: types.Video


@router.post("")
def run_inference(
    request: Request,
    credentials: HTTPAuthorizationCredentials = security.http_credentials,
):
    # print(request)
    data = {
        "avatar": {"content": request.avatar.content.decode()},
        "video": {"content": request.video.content.decode()},
        "merge": request.merge,
        "axis": request.axis,
    }
    response = requests.post(server_url, json=data, headers=headers)
    if response.status_code != 200:
        raise HTTPException(response.status_code, response.text)

    return response.json()
