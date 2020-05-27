from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import avatarify

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    avatarify.router,
    prefix="/api/v1/avatarify",
    tags=["api"],
    dependencies=[],
    responses={404: {"description": "Not found"}},
)
