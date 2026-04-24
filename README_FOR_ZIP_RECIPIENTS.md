# 📦 Welcome! You've Received the Crop Disease Detector

## 👋 Introduction

You've received a ZIP file containing a complete **AI-powered Crop Disease Detection System**. This guide will help you set it up and run it on your computer in about 20 minutes.

---

## 🎯 What This Application Does

- **Detects 60+ crop diseases** across 15+ crop types
- **AI-powered analysis** using deep learning models
- **Provides treatment recommendations** for each disease
- **Web-based interface** - easy to use in any browser
- **Works offline** after initial setup (except first-time model downloads)

### Supported Crops
Wheat, Rice, Maize, Tomato, Potato, Pepper, Cotton, Soybean, Cassava, Apple, Grape, Banana, Citrus, and more!

---

## 📋 What You Need

### Required
1. **Python 3.12+** - Download from https://python.org/downloads/
2. **2GB free disk space** - For dependencies and models
3. **Internet connection** - For initial setup only

### Optional
- **Git** - For version control (not required to run)

---

## 🚀 Quick Setup (3 Options)

### Option 1: Follow the Visual Flowchart
Open: **`SETUP_FLOWCHART.txt`**
- Visual step-by-step guide
- Includes troubleshooting flowcharts
- Time estimates for each step

### Option 2: Quick Text Guide
Open: **`QUICK_SETUP_FOR_RECIPIENTS.txt`**
- Simple copy-paste commands
- Organized by operating system
- Common problems & solutions

### Option 3: Detailed Instructions
Open: **`INSTALLATION_GUIDE_FOR_RECIPIENTS.md`**
- Comprehensive explanations
- Screenshots and examples
- Extensive troubleshooting section

---

## ⚡ Super Quick Start (For Experienced Users)

```bash
# Navigate to project
cd path/to/crop-disease-detector/python_site

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
# OR
source .venv/bin/activate      # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Initialize database
python scripts/init_db.py

# Run application
python run.py

# Open browser: http://127.0.0.1:5000
```

---

## 📚 Documentation Files Included

### For Setup
- **`QUICK_SETUP_FOR_RECIPIENTS.txt`** ⭐ Start here!
- **`INSTALLATION_GUIDE_FOR_RECIPIENTS.md`** - Detailed guide
- **`SETUP_FLOWCHART.txt`** - Visual flowchart

### For Usage
- **`QUICK_START.md`** - Features and usage guide
- **`python_site/README.md`** - Full technical documentation
- **`START_HERE.txt`** - Welcome and overview

### For GitHub (If You Want to Contribute)
- **`GITHUB_UPLOAD_INSTRUCTIONS.md`** - How to upload to GitHub
- **`upload_to_github.ps1`** - Automated upload script
- **`README.md`** - Project README

---

## 🎓 Step-by-Step Setup (Simplified)

### 1. Install Python
- Go to: https://python.org/downloads/
- Download Python 3.12 or higher
- **IMPORTANT:** Check ✅ "Add Python to PATH" during installation
- Verify: Open terminal and type `python --version`

### 2. Extract the ZIP
- Right-click the ZIP file
- Select "Extract All..."
- Choose a location (e.g., `C:\Projects\` or `~/Projects/`)

### 3. Open Terminal
- **Windows:** Press `Win+R`, type `powershell`, press Enter
- **macOS:** Press `Cmd+Space`, type `terminal`, press Enter
- **Linux:** Press `Ctrl+Alt+T`

### 4. Navigate to Project
```bash
cd path/to/crop-disease-detector/python_site
```
💡 **Tip:** Drag the `python_site` folder into the terminal to auto-fill the path!

### 5. Create Virtual Environment
```bash
python -m venv .venv
```
⏳ Takes 30-60 seconds

### 6. Activate Virtual Environment
**Windows PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

✅ **Success:** Your prompt should now show `(.venv)` at the start

### 7. Install Dependencies
```bash
pip install -r requirements.txt
```
⏳ Takes 5-10 minutes (downloads ~2GB)

### 8. Setup Environment File
**Windows:**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

### 9. Initialize Database
```bash
python scripts/init_db.py
```
✅ Should see: "Database initialized and seeded."

### 10. Run the Application
```bash
python run.py
```
✅ Should see: "Running on http://127.0.0.1:5000"

### 11. Open in Browser
Go to: **http://127.0.0.1:5000**

🎉 **You're done!** Start uploading crop images!

---

## 🔄 Running It Again (Next Time)

After the initial setup, you only need:

```bash
# 1. Navigate to project
cd path/to/crop-disease-detector/python_site

# 2. Activate virtual environment
.\.venv\Scripts\Activate.ps1  # Windows
# OR
source .venv/bin/activate      # macOS/Linux

# 3. Run application
python run.py

# 4. Open browser: http://127.0.0.1:5000
```

⏱️ **Takes less than 1 minute!**

---

## 🎯 How to Use the Application

1. **Open your browser** and go to http://127.0.0.1:5000
2. **Upload an image** of a crop leaf (drag & drop or click to browse)
3. **(Optional)** Select the crop type from the dropdown for better accuracy
4. **Click "Analyze"** or "Detect Disease"
5. **View results:**
   - Disease name
   - Confidence score (how sure the AI is)
   - Severity level (low/medium/high)
   - Symptoms description
   - Treatment recommendations

### Tips for Best Results
- Use **clear, well-lit photos** of leaves
- **Focus on diseased areas** if visible
- **Avoid blurry images**
- **Select crop type** if you know it (improves accuracy)

---

## ⚠️ Common Problems & Solutions

### "python is not recognized"
**Problem:** Python is not installed or not in PATH

**Solution:**
1. Install Python from python.org
2. During installation, check ✅ "Add Python to PATH"
3. Restart your terminal
4. Try `python3` instead of `python`

---

### "Cannot activate virtual environment" (Windows)
**Problem:** PowerShell script execution is disabled

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try activating again.

---

### "Port 5000 is already in use"
**Problem:** Another application is using port 5000

**Solution:** Edit `python_site/run.py` and change:
```python
app.run(host="0.0.0.0", port=5001, debug=debug)  # Changed to 5001
```
Then access: http://127.0.0.1:5001

---

### "ModuleNotFoundError: No module named 'app'"
**Problem:** You're not in the correct directory

**Solution:**
```bash
cd python_site
```
Make sure you're in the `python_site` folder, not the root folder.

---

### Installation is very slow
**Problem:** Large ML models are being downloaded

**Solution:**
- This is normal for the first installation
- Ensure stable internet connection
- Be patient (5-10 minutes)
- Models are cached after first download

---

### "Database not found" error
**Problem:** Database wasn't initialized

**Solution:**
```bash
python scripts/init_db.py
```

---

## 📊 What's Included

### Diseases (60+)
- **Fungal:** Rusts, blights, mildews, spots, rots
- **Bacterial:** Blights, spots, wilts, cankers
- **Viral:** Mosaics, tungro, greening

### Crops (15+)
- **Cereals:** Wheat, Rice, Maize/Corn
- **Vegetables:** Tomato, Potato, Pepper
- **Cash Crops:** Cotton, Soybean, Cassava
- **Fruits:** Apple, Grape, Banana, Citrus

### For Each Disease
- ✅ Name and description
- ✅ Symptoms to look for
- ✅ Treatment recommendations
- ✅ Severity level
- ✅ Affected crop type

---

## 🔒 Privacy & Security

- **All processing is local** - Your images stay on your computer
- **No data is sent to external servers** (except downloading ML models on first run)
- **No account required** - Use it completely offline after setup
- **No tracking or analytics**

---

## 💡 Tips & Tricks

### Stopping the Application
- Press `Ctrl+C` in the terminal
- Or close the terminal window

### Accessing from Other Devices
If you want to access from another device on your network:
1. Find your computer's IP address
2. Access: `http://YOUR_IP:5000`
3. Make sure your firewall allows connections

### Improving Accuracy
- Use the crop type selector
- Upload clear, focused images
- Ensure good lighting
- Capture diseased areas clearly

---

## 📞 Need More Help?

### Check These Files
1. **`QUICK_SETUP_FOR_RECIPIENTS.txt`** - Quick reference
2. **`INSTALLATION_GUIDE_FOR_RECIPIENTS.md`** - Detailed guide
3. **`SETUP_FLOWCHART.txt`** - Visual flowchart
4. **`python_site/README.md`** - Technical documentation

### Common Resources
- Python Download: https://python.org/downloads/
- Python Documentation: https://docs.python.org/
- Flask Documentation: https://flask.palletsprojects.com/

---

## 🎉 You're All Set!

Once you see the Flask server running and can access the web interface, you're ready to start detecting crop diseases!

**Happy detecting!** 🌾🔬

---

## 📝 Technical Details

### Technologies Used
- **Python 3.12+** - Programming language
- **Flask 3.0.3** - Web framework
- **PyTorch 2.5.1** - Machine learning
- **Transformers 4.46.3** - AI models
- **SQLite** - Database
- **Pillow** - Image processing

### System Requirements
- **OS:** Windows 10/11, macOS 10.15+, Ubuntu 20.04+
- **RAM:** 4GB minimum, 8GB recommended
- **Disk:** 2GB free space minimum
- **Python:** 3.10+ (3.12+ recommended)

### File Structure
```
crop-disease-detector/
├── python_site/              ← Main application
│   ├── app/                  ← Application code
│   ├── scripts/              ← Setup scripts
│   ├── instance/             ← Database (created during setup)
│   ├── .venv/                ← Virtual environment (created during setup)
│   ├── requirements.txt      ← Dependencies
│   └── run.py                ← Entry point
└── [Documentation files]
```

---

**Last Updated:** April 2026  
**Version:** 1.0  
**Tested On:** Windows 10/11, macOS 12+, Ubuntu 22.04

---

**Made with ❤️ for farmers and agricultural professionals worldwide** 🌾
