from python_path import PythonPath
import cv2

with PythonPath("."):
    from afy.predictor_local import PredictorLocal
    from afy.utils import Once, log, crop, pad_img, resize, TicToc
    from afy.utils import load_stylegan_avatar


config_path = "fomm/config/vox-adv-256.yaml"
checkpoint_path = "vox-adv-cpk.pth.tar"

model = PredictorLocal(
    config_path, checkpoint_path, relative=True, adapt_movement_scale=True
)
print(model)

IMG_SIZE = 256
size = (IMG_SIZE, IMG_SIZE)

frame_proportion = 0.9
frame_offset_x = 0
frame_offset_y = 0
stream_img_size = None

cap = cv2.VideoCapture(0)

avatar = cv2.imread("avatars/apipe.jpg")[..., ::-1]
avatar = cv2.resize(avatar, size)
print(avatar.shape)
model.set_source_image(avatar)

while True:
    grabbed, frame = cap.read()

    if not grabbed:
        break

    if stream_img_size is None:
        stream_img_size = frame.shape[1], frame.shape[0]

    frame = frame[..., ::-1]
    print(frame.shape)
    frame, lrudwh = crop(
        frame, p=frame_proportion, offset_x=frame_offset_x, offset_y=frame_offset_y,
    )
    print(frame.shape)
    frame = cv2.resize(frame, size)

    out = model.predict(frame)
    out = pad_img(out, stream_img_size)
    print(out.shape)

    cv2.imshow("original", frame[..., ::-1])
    cv2.imshow("deepfake", out[..., ::-1])
    cv2.waitKey(1)
