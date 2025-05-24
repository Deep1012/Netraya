from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import base64
import uvicorn
import os

from ultralytics import YOLO
from tensorflow.keras.models import load_model

app = FastAPI()

# If your frontend is served elsewhere, enable CORS:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load models once at startup ===
yolo_model = YOLO("best.pt")
cnn_model = load_model("cnn512_best_model.keras")

# CNN input shape & labels (update as needed)
IMG_HEIGHT = 512
IMG_WIDTH  = 512
class_names = ["Severe", "None", "Proliferative DR", "Mild", "Moderate"]

# File to track the simulated class index
simulation_mode = True  # Set to True to enable simulation by default
index_file = "simulated_class_index.txt"

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    # 1) Read & decode the uploaded image
    data = await file.read()
    arr  = np.frombuffer(data, np.uint8)
    img  = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(400, "Invalid image")

    # 2) YOLO inference
    results = yolo_model.predict(
        source=img,
        imgsz=416,
        conf=0.25,
        device="cpu",
        task="detect"   # use "segment" if you want masks
    )
    res = results[0]

    detections = []
    for box, conf, cls in zip(res.boxes.xyxy, res.boxes.conf, res.boxes.cls):
        detections.append({
            "class":      res.names[int(cls)],
            "confidence": float(conf),
            "bbox":       [float(x) for x in box.tolist()]
        })

    # 3) Annotate & encode YOLO image
    annotated = res.plot()             # draws boxes/masks on the image
    _, buf = cv2.imencode(".jpg", annotated)
    b64   = base64.b64encode(buf).decode("utf-8")
    annotated_data = f"data:image/jpeg;base64,{b64}"

    # 4) CNN classification preprocessing
    img_cnn = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_cnn = cv2.resize(img_cnn, (IMG_WIDTH, IMG_HEIGHT))
    img_cnn = img_cnn.astype(np.float32) / 255.0
    img_cnn = np.expand_dims(img_cnn, axis=0)  # [1,512,512,3]

    # 5) CNN inference
    if simulation_mode:
        # Use simulation logic for testing different diagnoses
        if os.path.exists(index_file):
            with open(index_file, "r") as f:
                try:
                    current_index = int(f.read().strip())
                except (ValueError, FileNotFoundError):
                    current_index = 0
        else:
            current_index = 0
            
        # Ensure we loop back after last class
        next_index = (current_index + 1) % len(class_names)
        
        # Save new index for next time
        with open(index_file, "w") as f:
            f.write(str(next_index))
        
        # Get the simulated class and create a prediction array
        idx = current_index
        
        # Create a prediction array with high confidence for the selected class
        pred = np.zeros(len(class_names))
        pred[idx] = 0.95  # High confidence
        
        print(f"Simulation Mode: Returning class '{class_names[idx]}' (index {idx})")
    else:
        # Normal model prediction
        pred = cnn_model.predict(img_cnn)[0]
        idx = int(np.argmax(pred))
        print(f"Model Prediction: Class '{class_names[idx]}' (index {idx})")
        
    cnn_result = {
        "class":      class_names[idx],
        "confidence": float(pred[idx])
    }

    # 6) Return structured JSON
    return JSONResponse({
        "yolo": {
            "detections":      detections,
            "annotated_image": annotated_data
        },
        "classification": cnn_result
    })

@app.post("/api/toggle-simulation")
async def toggle_simulation():
    global simulation_mode
    simulation_mode = not simulation_mode
    return JSONResponse({
        "simulation_mode": simulation_mode,
        "message": f"Simulation mode {'enabled' if simulation_mode else 'disabled'}"
    })

@app.get("/api/simulation-status")
async def simulation_status():
    return JSONResponse({
        "simulation_mode": simulation_mode
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
