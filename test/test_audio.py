from moviepy.editor import *
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

video_path = "drums2.mp4"
audio_path = "drums_audio.mp3"
video = VideoFileClip(video_path)  # 2.
audio = video.audio  # 3.
# audio.write_audiofile(audio_path)  # 4.

video = video.subclip(0, -123)
# video.write_videofile("drums2.mp4")

# adds audio.mp3 to video if are same length
# final.write_videofile("output.mp4", audio="audio.mp3")

video_path = "drums2.mp4"
video_frames = list(bytes2video(read_fn(video_path)))

fps = 30.0
video = VideoClip(
    lambda t: video_frames[int(t * fps)], duration=len(video_frames) / fps
)
audio_path = "drums_audio.mp3"
audio = AudioFileClip(audio_path)
video = video.set_audio(audio.set_duration(video.duration))
video.write_videofile("new_video.mp4", fps=fps, audio_fps=44100)
