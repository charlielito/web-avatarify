from pydantic import BaseModel


class ImageSource(BaseModel):
    imageUri: str


class Image(BaseModel):
    content: bytes = None
    source: ImageSource = None


class Video(BaseModel):
    content: bytes = None
    # source: ImageSource = None


class Request(BaseModel):
    avatar: Image
    video: Video
    merge: bool = False
    axis: int = 1
    fps: float = 30.0
    transferFace: bool = True
    flip: bool = False
