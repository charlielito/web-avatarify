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

from app import io, model_funs, security, types

router = APIRouter()
server_url = os.getenv("SERVER_URL")


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
    response = requests.post(server_url, data=request)
    if response.status_code != 200:
        raise HTTPException(response.status_code, response.text)

    return response.json()
