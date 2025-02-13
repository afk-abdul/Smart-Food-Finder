# RestaurantFinder


# 🛠 Django Backend Setup Guide

Follow these steps to set up and run the Django backend environment.

---

## 🚀 Setting Up the Virtual Environment

### **1. Open the Terminal**
Ensure you have **Python 3** installed. If not, install it using on Mac/Linux:
```sh
sudo apt update && sudo apt install python3 python3-venv python3-pip -y
```
Else Download Manully From Python's Website on Windows

### **2. Create a Virtual Environment**
Run:
```sh
python3 -m venv venv
```

### **3. Activate the Virtual Environment**
- **Linux/macOS:**
  ```sh
  source venv/bin/activate
  ```
- **Windows (CMD):**
  ```sh
  venv\Scripts\activate
  ```
- **Windows (PowerShell):**
  ```sh
  venv\Scripts\Activate.ps1
  ```

### **4. Install Dependencies**
Once the virtual environment is activated, install the required packages:
```sh
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary dj-database-url
```

### **5. Deactivating the Virtual Environment**
To deactivate the virtual environment, simply run:
```sh
deactivate
```

---

## 🚀 Running the Django Server

### **1. Navigate to the Backend Directory**
```sh
cd backend
```

### **2. Start the Django Development Server**
```sh
python manage.py runserver
```
This will start the server at **http://127.0.0.1:8000/**.

---

### 🎯 **Next Steps**
- Configure your **`settings.py`** with database credentials.
- Run migrations:
  ```sh
  python manage.py migrate
  ```
- Create a superuser (if needed):
  ```sh
  python manage.py createsuperuser
  ```

---

