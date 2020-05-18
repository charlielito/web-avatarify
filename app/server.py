from fastapi import FastAPI

from .api import avatarify

app = FastAPI()

app.include_router(
    avatarify.router,
    prefix="/api/v1/avatarify",
    tags=["api"],
    dependencies=[],
    responses={404: {"description": "Not found"}},
)
