from pydantic import BaseModel


class ImageSource(BaseModel):
    imageUri: str


class Image(BaseModel):
    content: bytes = None
    source: ImageSource = None


class Video(BaseModel):
    content: bytes = None
    # source: ImageSource = None
