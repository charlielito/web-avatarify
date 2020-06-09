import face_alignment
import numpy as np
import cv2


import threading
import cv2


class VideoCaptureThreading:
    def __init__(self, src=0, width=640, height=480):
        self.src = src
        self.cap = cv2.VideoCapture(self.src)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
        self.grabbed, self.frame = self.cap.read()
        self.started = False
        self.read_lock = threading.Lock()

    def set(self, var1, var2):
        self.cap.set(var1, var2)

    def start(self):
        if self.started:
            print("[!] Threaded video capturing has already been started.")
            return None
        self.started = True
        self.thread = threading.Thread(target=self.update, args=())
        self.thread.start()
        return self

    def update(self):
        while self.started:
            grabbed, frame = self.cap.read()
            with self.read_lock:
                self.grabbed = grabbed
                self.frame = frame

    def read(self):
        with self.read_lock:
            frame = self.frame.copy()
            grabbed = self.grabbed
        return grabbed, frame

    def stop(self):
        self.started = False
        self.thread.join()

    def __exit__(self, exec_type, exc_value, traceback):
        self.cap.release()


def bb_intersection_over_union(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)
    boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1)
    boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1)
    iou = interArea / float(boxAArea + boxBArea - interArea)
    return iou


def extract_bbox(frame, refbbox, fa):
    bboxes = fa.face_detector.detect_from_image(frame[..., ::-1])
    if len(bboxes) != 0:
        bbox = max(
            [
                (bb_intersection_over_union(bbox, refbbox), tuple(bbox))
                for bbox in bboxes
            ]
        )[1]
    else:
        bbox = np.array([0, 0, 0, 0, 0])
    return np.maximum(np.array(bbox), 0)


def get_max_length(bbox):
    x1, y1, x2, y2 = bbox
    w = x2 - x1
    h = y2 - y1
    square_length = max(w, h)
    return square_length


def get_face_bbox(image, face_detector):
    bboxes = face_detector.face_detector.detect_from_image(frame)
    if not bboxes:
        return []

    growth_factor = 0.4
    img_h, img_w = image.shape[:2]

    bbox = list(map(int, bboxes[0]))
    x1, y1, x2, y2, score = bbox
    square_length = get_max_length((x1, y1, x2, y2))
    dlength = int(growth_factor * square_length)

    x1 = max(0, x1 - dlength)
    y1 = max(0, y1 - dlength)
    x2 = min(img_w - 1, x2 + dlength)
    y2 = min(img_h - 1, y2 + int(dlength * 0.5))

    output_length = get_max_length((x1, y1, x2, y2))

    return (x1, y1, x1 + output_length, y1 + output_length)


fa = face_alignment.FaceAlignment(
    face_alignment.LandmarksType._2D, flip_input=True, device="cpu"
)

# cap = cv2.VideoCapture(0)
cap = VideoCaptureThreading(0)
cap.start()
bbox = []
# Capture initial video
while True:
    grabbed, frame = cap.read()
    if not grabbed:
        break
    frame = frame[..., ::-1].copy()

    # bboxes = fa.face_detector.detect_from_image(frame)
    # print(bboxes)
    bbox = get_face_bbox(frame, fa)
    x1, y1, x2, y2 = bbox
    if bbox:
        # bbox = list(map(int, bboxes[0]))
        cv2.rectangle(frame, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (255, 255, 255))

    cv2.imshow("original", frame[..., ::-1])
    cv2.imshow("cropped", frame[y1:y2, x1:x2][..., ::-1])

    key = cv2.waitKey(1)

    if key == 27:  # ESC
        break


# cap.release()
cap.stop()
cv2.destroyAllWindows()
