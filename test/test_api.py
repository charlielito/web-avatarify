import base64
import os
import sys
import tempfile
import time
from io import BytesIO

import cv2
import numpy as np
import PIL
import requests
from python_path import PythonPath

with PythonPath("."):
    from app.io import (
        read_image,
        image2bytes,
        get_frames_from_camera,
        write_video,
        read_fn,
        bytes2video,
    )


url = "http://localhost:8008"
test_image_path = "avatars/einstein.jpg"

# url = "http://3.133.146.72:8000"
# url = "https://avatarify-ejf7gidppa-uc.a.run.app"

api_token = os.getenv("API_TOKEN")

if os.path.exists(test_image_path):
    img = read_image(test_image_path)
    img = cv2.resize(img, fx=0.5, fy=0.5, dsize=None)

    image = image2bytes(img)
    image = base64.b64encode(image).decode()
else:
    image = None


# with tempfile.TemporaryFile(suffix=".mp4") as fp:
fp = "temp.mp4"
# video_frames = get_frames_from_camera(0)
# write_video(fp, video_frames)
video_bytes = read_fn(fp)
video = base64.b64encode(video_bytes).decode()

data = {
    "avatar": {"content": image, "source": {"imageUri": test_image_path}},
    "video": {"content": video},
}

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_token}",
}
print(data, headers)
print(img.shape) if image is not None else None
print("Sending request...")
print(f"Size of body in Mb: {sys.getsizeof(image)/10**6}")
# exit()
init = time.time()
response = requests.post(f"{url}/api/v1/avatarify", json=data, headers=headers)
print(response, response.text)
print(response.json())
print(f"Elapsed:  {time.time()-init}")

show_result = False
if response.status_code == 200 and show_result:
    response = response.json()
    video_bytes = base64.b64decode(response["video"]["content"])
    for frame in bytes2video(video_bytes):
        cv2.imshow("Result", frame)
        cv2.waitKey(200)
