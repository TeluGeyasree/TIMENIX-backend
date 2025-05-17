import cv2
from deepface import DeepFace

def classify_age(age):
    if age <= 10:
        return "1-10"
    elif 11 <= age <= 15:
        return "11-15"
    else:
        return "15+"
cam = cv2.VideoCapture(0)

if not cam.isOpened():
    print("Error: Cannot open webcam.")
    exit()

ret, frame = cam.read()
if not ret:
    print("Failed to grab frame.")
    cam.release()
    exit()

try:
    result = DeepFace.analyze(
        frame,
        actions=['age'],
        detector_backend='retinaface',
        enforce_detection=True
    )

    face = result[0] if isinstance(result, list) else result
    age = int(face['age'])
    age_group = classify_age(age)

    print(f"\n✅ Detected Age Group: {age_group}")

except Exception as e:
    print(f"❌ No face detected or error: {e}")

cam.release()