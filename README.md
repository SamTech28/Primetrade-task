# Task Manager Full-Stack Application

A robust, full-stack REST API and React Frontend built as an internship-level project. This project demonstrates backend architecture, JWT authentication, secure password hashing, and a modern UI using React and Vite.

## 🚀 Deliverables Status
- [x] Backend project hosted on GitHub
- [x] Working REST APIs for Authentication & Task CRUD
- [x] React UI connected securely to the Python backend
- [x] API Documentation & Scalability Note

---

## 🛠️ Tech Stack
- **Backend:** Python + Flask
- **Database:** MongoDB (using PyMongo)
- **Security:** bcrypt (password hashing), Flask-JWT-Extended (Token auth)
- **Frontend:** React + Vite, Axios, React Router Dom
- **CSS:** Custom Glassmorphism Dark Theme (Plain CSS)

---

## 🧠 System Architecture & Scalability

If this application was required to scale for millions of users, the following architectural upgrades would be implemented:

1. **Caching Layer (Redis):** Frequently accessed resources (like a user's task list) would be cached in Redis. Instead of querying MongoDB on every page refresh, the API would fetch the data instantly from RAM, significantly reducing database load.
2. **Microservices Architecture:** 
   * **Auth Service:** A dedicated server handling only Logins, Registrations, and Token issuing.
   * **Task Service:** A separate server handling only CRUD operations for tasks. 
   *(This ensures that if the Task Service crashes under heavy load, users can still log in and use other parts of the platform).*
3. **Load Balancing:** Deploying behind an NGINX reverse proxy or AWS Application Load Balancer (ALB) to distribute incoming traffic across multiple instances of the Flask API.

---

## ⚙️ How to Run Locally

### 1. Setup the Python Backend
1. Navigate to the backend directory: `cd task_manager/backend`
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate   # (Windows)
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server (runs on Port 5000 by default):
   ```bash
   python app.py
   ```

### 2. Setup the React Frontend
1. Open a *new* terminal window.
2. Navigate to the frontend directory: `cd task_manager/frontend`
3. Install Node modules:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173/`

---

## 📖 API Documentation

### Authentication Routes (`/api/v1/user`)
| Method | Endpoint | Description | Body Example |
|--------|----------|-------------|--------------|
| `POST` | `/register` | Create a new user | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/login` | Authenticate an existing user | `{ "email": "...", "password": "..." }` |

### Task Routes (`/api/v1/tasks`) *(JWT Required)*
| Method | Endpoint | Description | Body Example | Header |
|--------|----------|-------------|--------------|--------|
| `POST` | `/` | Create a new task securely mapped to User ID | `{ "title": "...", "description": "..." }` | `Authorization: Bearer <token>` |
| `GET` | `/` | Fetch all tasks belonging exclusively to the User | *(None)* | `Authorization: Bearer <token>` |
| `DELETE` | `/<task_id>` | Permanently delete a specific task | *(None)* | `Authorization: Bearer <token>` |
