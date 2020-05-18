
import os
from typing import Optional

from fastapi import Security
from fastapi.exceptions import HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.security.utils import get_authorization_scheme_param
from starlette.requests import Request
from starlette.status import HTTP_403_FORBIDDEN


class CustomHTTPBearer(HTTPBearer):
    def __init__(self, token, **kwargs):
        super().__init__(**kwargs)
        self.token = token

    async def __call__(
        self, request: Request
    ) -> Optional[HTTPAuthorizationCredentials]:
        authorization: str = request.headers.get("Authorization")
        scheme, credentials = get_authorization_scheme_param(authorization)
        if credentials != self.token:
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail="Invalid authentication credentials",
            )
        else:
            await super().__call__(request)

API_TOKEN = os.getenv("API_TOKEN")
http_credentials = Security(CustomHTTPBearer(API_TOKEN))
