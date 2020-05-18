import os

import face_alignment
import requests
from tqdm import tqdm


def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith("download_warning"):
            return value
    return None


def save_response_content(r, dest):
    # unfortunately content-length is not provided in header
    total_iters = 250000  # in KB
    print("Note: units are in KB, e.g. KKB = MB")
    # because we are reading 1024 bytes at a time, hence
    # 1KB == 1 "unit" for tqdm
    with open(dest, "wb") as f:
        for chunk in tqdm(
            r.iter_content(1024), total=total_iters, unit="KB", unit_scale=True
        ):
            if chunk:  # filter out keep-alive new chunks
                f.write(chunk)


def download_file(file_id, dest):
    drive_url = "https://docs.google.com/uc?export=download"
    session = requests.Session()
    response = session.get(drive_url, params={"id": file_id}, stream=True)
    token = get_confirm_token(response)

    if token:
        params = {"id": file_id, "confirm": token}
        response = session.get(drive_url, params=params, stream=True)

    save_response_content(response, dest)


if __name__ == "__main__":
    document_id = "1coUCdyRXDbpWnEkA99NLNY60mb9dQ_n3"
    dst = "./vox-adv-cpk.pth.tar"
    download_file(document_id, dst)
    face_alignment.FaceAlignment(
        face_alignment.LandmarksType._2D, flip_input=True, device=os.getenv("DEVICE")
    )
