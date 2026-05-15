# Crop Disease Detector (Python + Flask)
This is the Python-only rewrite of the crop disease detector, replacing the previous React/Node runtime with Flask, SQLite, and Python ML inference.

## What changed
- Flask server-rendered web app (`app/routes.py`, `app/templates/*`)
- Real model inference pipeline (`app/inference.py`) with:
  - local fine-tuned checkpoint priority (`models/local_classifier.pt`)
  - pretrained fallback models for multicrop, cassava, and rice
  - low-confidence unknown handling
- SQLite persistence for predictions and disease knowledge (`app/models.py`)
- Dataset + training scripts for improving class coverage (`scripts/build_dataset.py`, `scripts/train_model.py`)

## Quick start
From `python_site/`:

1) Create venv
```powershell
& "C:\Users\HP\AppData\Local\Programs\Python\Python312\python.exe" -m venv .venv
```

2) Activate venv
```powershell
.\.venv\Scripts\Activate.ps1
```

3) Install dependencies
```powershell
pip install -r requirements.txt
```

4) Initialize database
```powershell
python scripts\init_db.py
```

5) Run local preview
```powershell
python run.py
```

Open `http://127.0.0.1:5000`.

## Improve dataset and retrain
Build a base dataset:
```powershell
python scripts\build_dataset.py --output dataset\combined
```

Train a local model checkpoint:
```powershell
python scripts\train_model.py --data-dir dataset\combined --epochs 5 --output models\local_classifier.pt
```

After training, the app automatically prioritizes `models/local_classifier.pt` for predictions.

## Environment variables
Copy `.env.example` to `.env` and adjust values as needed:
- `UNKNOWN_THRESHOLD`
- `PRIMARY_MODEL_ID`
- `CASSAVA_MODEL_ID`
- `RICE_MODEL_ID`
- `HF_TOKEN` (optional)

## API endpoints
- `GET /api/health`
- `POST /api/predict` with form-data:
  - `leaf_image` file
  - `crop_type` optional (or `auto`)

## PythonAnywhere deployment note (torch error fix)
If your web app log shows `ModuleNotFoundError: No module named 'torch'`, install dependencies in the **same virtualenv used by your WSGI app**:

```bash
cd ~/crop-disease-detector/python_site
mkvirtualenv --python=/usr/bin/python3.11 cropdetector-311   # run once
workon cropdetector-311
pip install -r requirements.txt
```

Then in the PythonAnywhere **Web** tab:
1. Set your virtualenv path to that environment.
2. Reload the web app.
3. Check `/api/health` and confirm `inference.torch_available` is `true`.
