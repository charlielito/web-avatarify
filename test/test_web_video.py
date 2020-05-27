from moviepy.editor import *
from python_path import PythonPath
import cv2
import ffmpeg

with PythonPath("."):
    from app.io import (
        read_image,
        image2bytes,
        get_frames_from_camera,
        write_video,
        read_fn,
        bytes2video,
        get_audio_obj,
    )
from moviepy.editor import *
import tempfile

video_path = "download.webm"

# video_path = "sisa.webm"
# audio = AudioFileClip(video_path)
# video = VideoFileClip(video_path, fps_source="fps")
# print(video)
# print(len([frame for frame in video.iter_frames()]))

# ffmpeg -i current.webm -c copy -fflags +genpts new.webm

video_bytes = read_fn(video_path)
print(get_audio_obj(video_bytes))
exit(0)

with tempfile.TemporaryDirectory() as temp_dir:
    print(temp_dir)
    tmp_video = temp_dir + "/sisa.webm"
    tmp_video2 = temp_dir + "/sisa2.webm"
    with open(tmp_video, "wb") as f:
        f.write(video_bytes)

    input = ffmpeg.input(tmp_video)
    out = ffmpeg.output(
        input, tmp_video2, vcodec="copy", acodec="copy", fflags="+genpts"
    )
    ffmpeg.run(out)

    audio = AudioFileClip(tmp_video2)
print(audio)
exit()


frames = list(bytes2video(video_bytes))

for i, frame in enumerate(frames):
    cv2.putText(frame, str(i), (10, 50), 0, 2, (255, 255, 255))
    cv2.imshow("video", frame)
    cv2.waitKey(33)
print(len(frames))
