# 🍽️ RestaurantFinder

A full-stack Restaurant Finder web app built using **Django (REST Framework)** for the backend and **React with Tailwind CSS** for the frontend.

---

## 🛠 Django Backend Setup Guide

Follow these steps to set up and run the Django backend environment.

---

### 🚀 Setting Up the Virtual Environment

#### 1. **Open the Terminal**

Ensure you have **Python 3** installed.

- On **Linux/macOS**:

  ```bash
  sudo apt update && sudo apt install python3 python3-venv python3-pip -y
  ```

- On **Windows**: [Download Python manually](https://www.python.org/downloads)

---

#### 2. **Create a Virtual Environment**

```bash
python3 -m venv venv
or
python -m venv venv
```

---

#### 3. **Activate the Virtual Environment**

- **Linux/macOS:**
  ```bash
  source venv/bin/activate
  ```
- **Windows (CMD):**
  ```cmd
  venv\Scripts\activate
  ```
- **Windows (PowerShell):**
  ```powershell
  venv\Scripts\Activate.ps1
  ```

---

#### 4. **Install Backend Dependencies**

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary dj-database-url
```

---

#### 5. **Deactivating the Virtual Environment**

```bash
deactivate
```

---

### 🚀 Running the Django Server

#### 1. Navigate to the Backend Directory

```bash
cd backend
```

#### 2. Run Migrations

```bash
python manage.py migrate
```

#### 3. Start the Django Development Server

```bash
python manage.py runserver
```

> 📍 Opens at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🌐 React Frontend Setup Guide

---

### ⚙️ Install Node Modules

```bash
cd frontend
npm install
```

---

### 🎨 Tailwind CSS Setup

#### 1. Install Tailwind CSS

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

or

npm install -D tailwindcss@3
npx tailwindcss init -p
```

#### 2. Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

#### 3. Configure `index.css`

In `src/index.css`, add the following at the top:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

#### 4. Import CSS in `src/index.js`

```js
import "./index.css";
```

---

### ▶️ Start the React App

```bash
npm start
```

> 📍 Opens at: [http://localhost:3000](http://localhost:3000)

---

## 📦 Technologies Used

- Django + Django REST Framework
- React
- Tailwind CSS
- PostgreSQL (can be swapped with SQLite for development)
- JWT Authentication
- React Router

---

## ✨ License

MIT © 2025

---
