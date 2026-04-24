# 📦 Installation Guide for Recipients

## For Anyone Who Receives This Project as a ZIP File

This guide will help you set up and run the Crop Disease Detector on your local machine.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [What to Download & Install](#what-to-download--install)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)

---

## 💻 System Requirements

- **Operating System:** Windows 10/11, macOS, or Linux
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** At least 2GB free space
- **Internet Connection:** Required for initial setup (downloading dependencies and ML models)

---

## 📥 What to Download & Install

### 1. Python (Required)

**What is it?** Python is the programming language this application is built with.

**Download:**
- **Windows:** https://www.python.org/downloads/
  - Click "Download Python 3.12.x" (or latest version)
  - **IMPORTANT:** During installation, check ✅ "Add Python to PATH"
- **macOS:** https://www.python.org/downloads/macos/
- **Linux:** Usually pre-installed, or use: `sudo apt install python3 python3-pip`

**Verify Installation:**
```bash
python --version
# Should show: Python 3.12.x or higher
```

### 2. Git (Optional, but Recommended)

**What is it?** Version control system (useful for updates).

**Download:**
- **Windows:** https://git-scm.com/download/win
- **macOS:** https://git-scm.com/download/mac
- **Linux:** `sudo apt install git`

---

## 🚀 Step-by-Step Setup

### Step 1: Extract the ZIP File

1. **Locate the ZIP file** you received (e.g., `crop-disease-detector.zip`)
2. **Right-click** on the ZIP file
3. Select **"Extract All..."** or **"Extract Here"**
4. Choose a location (e.g., `C:\Projects\` or `~/Projects/`)
5. Wait for extraction to complete

**Result:** You should have a folder named `crop-disease-detector` (or similar)

---

### Step 2: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `powershell` and press Enter
- OR search for "PowerShell" in Start Menu

**macOS:**
- Press `Cmd + Space`
- Type "Terminal" and press Enter

**Linux:**
- Press `Ctrl + Alt + T`

---

### Step 3: Navigate to the Project Folder

In the terminal, type:

```bash
cd path/to/extracted/folder/python_site
```

**Example (Windows):**
```powershell
cd C:\Projects\crop-disease-detector\python_site
```

**Example (macOS/Linux):**
```bash
cd ~/Projects/crop-disease-detector/python_site
```

**Tip:** You can drag and drop the folder into the terminal to auto-fill the path!

---

### Step 4: Create a Virtual Environment

**What is this?** A virtual environment keeps this project's dependencies separate from other Python projects.

**Windows (PowerShell):**
```powershell
python -m venv .venv
```

**macOS/Linux:**
```bash
python3 -m venv .venv
```

**Wait:** This takes 30-60 seconds. You'll see a new `.venv` folder created.

---

### Step 5: Activate the Virtual Environment

**Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
.venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

**Success Indicator:** Your terminal prompt should now start with `(.venv)`

**Example:**
```
(.venv) PS C:\Projects\crop-disease-detector\python_site>
```

---

### Step 6: Install Dependencies

**What is this?** Installing all the required Python packages (Flask, PyTorch, etc.)

```bash
pip install -r requirements.txt
```

**Wait Time:** 5-10 minutes (downloads ~2GB of packages)

**What's being installed:**
- Flask (web framework)
- PyTorch (machine learning)
- Transformers (AI models)
- Pillow (image processing)
- SQLAlchemy (database)
- And more...

**Progress:** You'll see lots of text scrolling. This is normal!

---

### Step 7: Set Up Environment Variables

**Option A: Copy the example file**

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

**Option B: Manual copy**
1. Find the file `.env.example` in the `python_site` folder
2. Copy it
3. Rename the copy to `.env` (remove `.example`)

**Note:** The default settings work fine for local testing!

---

### Step 8: Initialize the Database

**What is this?** Creating the database and loading the disease library (60+ diseases)

```bash
python scripts/init_db.py
```

**Expected Output:**
```
Database initialized and seeded.
```

**What happened:** A database file was created at `instance/crop_disease.db` with all disease information.

---

### Step 9: Run the Application

```bash
python run.py
```

**Expected Output:**
```
 * Serving Flask app 'app'
 * Debug mode: off
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

**Success!** The application is now running! 🎉

---

## 🌐 Running the Application

### Access the Web Interface

1. **Open your web browser** (Chrome, Firefox, Edge, Safari)
2. **Go to:** http://127.0.0.1:5000
3. **You should see** the Crop Disease Detector homepage!

### Using the Application

1. **Click** "Upload Image" or drag and drop a crop leaf image
2. **(Optional)** Select the crop type from the dropdown
3. **Click** "Analyze" or "Detect Disease"
4. **View Results:**
   - Disease name
   - Confidence score
   - Symptoms
   - Treatment recommendations

### Stopping the Application

- **In the terminal:** Press `Ctrl + C`
- **Or:** Close the terminal window

---

## 🔧 Troubleshooting

### Problem: "python is not recognized"

**Solution:**
- Python is not installed or not in PATH
- Reinstall Python and check ✅ "Add Python to PATH"
- Restart your terminal after installation

**Alternative:** Try `python3` instead of `python`

---

### Problem: "Cannot activate virtual environment"

**Windows PowerShell Error:**
```
.ps1 cannot be loaded because running scripts is disabled
```

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try activating again.

---

### Problem: "pip install fails" or "No module named..."

**Solution 1:** Upgrade pip
```bash
python -m pip install --upgrade pip
```

**Solution 2:** Install packages one by one
```bash
pip install Flask==3.0.3
pip install torch==2.5.1
pip install transformers==4.46.3
```

---

### Problem: "Port 5000 is already in use"

**Solution:** Change the port in `run.py`

Edit `python_site/run.py`:
```python
app.run(host="0.0.0.0", port=5001, debug=debug)  # Changed to 5001
```

Then access: http://127.0.0.1:5001

---

### Problem: "ModuleNotFoundError: No module named 'app'"

**Solution:** Make sure you're in the `python_site` directory
```bash
cd python_site
```

---

### Problem: Models downloading slowly or failing

**Cause:** Large ML models are being downloaded from Hugging Face

**Solution:**
- Be patient (first run takes 5-10 minutes)
- Ensure stable internet connection
- Models are cached after first download

---

### Problem: "Database not found" or "No such table"

**Solution:** Re-initialize the database
```bash
python scripts/init_db.py
```

---

## 📁 Project Structure (What's Inside)

```
crop-disease-detector/
├── python_site/                    ← Main application folder
│   ├── app/                        ← Application code
│   │   ├── __init__.py
│   │   ├── routes.py               ← Web routes
│   │   ├── inference.py            ← AI detection
│   │   ├── models.py               ← Database models
│   │   ├── seed_data.py            ← 60+ diseases
│   │   ├── static/                 ← CSS, JS, images
│   │   └── templates/              ← HTML pages
│   ├── scripts/
│   │   ├── init_db.py              ← Database setup
│   │   ├── build_dataset.py
│   │   └── train_model.py
│   ├── instance/                   ← Database files
│   ├── uploads/                    ← Uploaded images
│   ├── models/                     ← ML models
│   ├── .env.example                ← Config template
│   ├── .env                        ← Your config (create this)
│   ├── requirements.txt            ← Dependencies list
│   ├── run.py                      ← Start here!
│   └── README.md                   ← Documentation
└── [Other documentation files]
```

---

## 🎯 Quick Command Reference

### First Time Setup (Do Once)
```bash
# 1. Navigate to project
cd path/to/crop-disease-detector/python_site

# 2. Create virtual environment
python -m venv .venv

# 3. Activate virtual environment
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
# OR
source .venv/bin/activate      # macOS/Linux

# 4. Install dependencies
pip install -r requirements.txt

# 5. Copy environment file
Copy-Item .env.example .env    # Windows
# OR
cp .env.example .env           # macOS/Linux

# 6. Initialize database
python scripts/init_db.py

# 7. Run application
python run.py
```

### Every Time After (Quick Start)
```bash
# 1. Navigate to project
cd path/to/crop-disease-detector/python_site

# 2. Activate virtual environment
.\.venv\Scripts\Activate.ps1  # Windows
# OR
source .venv/bin/activate      # macOS/Linux

# 3. Run application
python run.py
```

---

## 🌟 Features You Can Use

### Supported Crops (15+)
- Wheat, Rice, Maize/Corn
- Tomato, Potato, Pepper
- Cotton, Soybean, Cassava
- Apple, Grape, Banana, Citrus

### Diseases Detected (60+)
- Fungal diseases (rusts, blights, mildews)
- Bacterial diseases (spots, wilts)
- Viral diseases (mosaics, tungro)

### Each Detection Includes:
- ✅ Disease name
- ✅ Confidence score
- ✅ Severity level
- ✅ Symptoms description
- ✅ Treatment recommendations

---

## 📞 Need More Help?

### Check These Files:
- `QUICK_START.md` - Quick reference
- `python_site/README.md` - Detailed documentation
- `START_HERE.txt` - Welcome guide

### Common Issues:
- Make sure Python 3.12+ is installed
- Always activate the virtual environment before running
- Ensure you're in the `python_site` directory
- Check your internet connection for first-time model downloads

---

## 🎉 You're All Set!

Once you see the Flask server running and can access http://127.0.0.1:5000, you're ready to detect crop diseases!

**Happy detecting!** 🌾🔬

---

**Last Updated:** April 2026
**Python Version:** 3.12+
**Tested On:** Windows 10/11, macOS, Ubuntu Linux
