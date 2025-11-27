# Leave Management System with Face Recognition

This project is a comprehensive Leave Management System featuring a **React-based Frontend**, a **PHP/MySQL backend** (containerized with Docker), and a **Python-based Face Recognition system** for secure user verification.

## 💻 Tech Stack

- **Frontend:** React.js, HTML5, CSS3, JavaScript
- **Backend:** PHP (Hosted on Apache)
- **Database:** MySQL / MariaDB
- **Containerization:** Docker (XAMPP image)
- **Face Recognition:** Python 3, OpenCV, face_recognition library

---

## 📂 Project Structure

- **`Leave-Management-FrontEnd-development/`**: The React frontend application.
- **`leaveManagementAPIs/`**: PHP backend API files.
- **`save_face.py`**: Python script to capture and register user face data.
- **`verify_face.py`**: Python script to verify a user's identity.

---

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
- **Docker Desktop** (to run the XAMPP container)
- **Node.js & npm** (to run the React frontend)
- **Python 3.x** (for face recognition scripts)

---

## 🛠️ Installation & Setup

### 1. Set up the Backend (Docker + XAMPP)

We use a Docker container running XAMPP to host the PHP APIs and MySQL database.

1.  **Pull and Run the XAMPP Container:**
    ```bash
    # Run XAMPP container (forwarding ports 80 and 3306)
    docker run --name xampp-server -p 80:80 -p 3306:3306 -d tomsik68/xampp
    ```
    *(Note: If you are on an Apple Silicon Mac (M1/M2), add `--platform linux/amd64`)*.

2.  **Deploy PHP Files:**
    Copy the API files into the container's web server directory (`htdocs`).
    ```bash
    # Run this from the project root
    docker cp ./leaveManagementAPIs/. xampp-server:/opt/lampp/htdocs/
    ```

3.  **Start Services:**
    Ensure Apache and MySQL are running inside the container:
    ```bash
    docker exec -it xampp-server /opt/lampp/lampp start
    ```

4.  **Database Configuration:**
    - Go to `http://localhost/phpmyadmin`.
    - Create a new database (e.g., `leave_management`).
    - Import the database schema if provided, or create tables manually.

---

### 2. Set up the Frontend (React)

The frontend connects to the XAMPP backend.

1.  **Navigate to the frontend directory:**
    ```bash
    cd Leave-Management-FrontEnd-development
    ```

2.  **Install Dependencies:**
    This installs React and other libraries listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Start the Application:**
    This launches the React development server (usually at `http://localhost:3000`).
    ```bash
    npm start
    ```

---

### 3. Set up Python Environment

The Python scripts are used for face registration and verification.

1.  **Install System Dependencies:**
    - *Windows:* [Visual Studio C++ build tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (required for dlib).
    - *Mac:* `brew install cmake`
    - *Linux:* `sudo apt-get install cmake`

2.  **Install Python Libraries:**
    ```bash
    pip install opencv-python numpy face_recognition requests
    ```

---

## 🏃‍♂️ Usage Workflow

1.  **Start Backend:** Ensure your Docker container is running (`docker start xampp-server`).
2.  **Start Frontend:** Run `npm start` in the frontend terminal window.
3.  **Register Face:** Run `python save_face.py` to add a new user's face data.
4.  **Login/Verify:** Run `python verify_face.py` to authenticate.

---

## 📝 Notes
- **API Endpoints:** Ensure your React components are fetching data from `http://localhost/YOUR_PHP_FILE.php`.
- **CORS:** If your React app (port 3000) cannot talk to PHP (port 80), you may need to add CORS headers to your PHP files.