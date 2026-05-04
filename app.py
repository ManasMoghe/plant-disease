from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import io
import json

app = Flask(__name__)
CORS(app)  # allow React dev server (localhost:3000) to call this

model = load_model("cropcare_model.h5")

with open("class_names.json") as f:
    class_names = json.load(f)

IMG_SIZE = (128, 128)


@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["file"]
    img = Image.open(io.BytesIO(file.read())).convert("RGB").resize(IMG_SIZE)
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    pred = model.predict(img_array)[0]          # shape: (23,)
    top5_indices = np.argsort(pred)[::-1][:5]   # top 5 class indices

    top5 = [
        {
            "rank": int(i + 1),
            "class": class_names[idx],
            "probability": round(float(pred[idx]) * 100, 2),
        }
        for i, idx in enumerate(top5_indices)
    ]

    predicted_class = class_names[top5_indices[0]]
    confidence = round(float(pred[top5_indices[0]]) * 100, 2)

    return jsonify({
        "class": predicted_class,
        "confidence": confidence,
        "top5": top5,
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
