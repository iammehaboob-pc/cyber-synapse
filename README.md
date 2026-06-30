# 🌌 Neon Memory
Neon Memory is a modern, full-stack browser-based **Memory Card Game** with a futuristic **Cyberpunk** theme.

Built using **React (Vite)**, **Node.js**, **Express**, and **MongoDB**, the application features secure JWT authentication, responsive glassmorphism UI, synthesized sound effects using the Web Audio API, and an online leaderboard with real-time score tracking.

---

## ✨ Features

- 🎮 Classic Memory Card gameplay
- 🔐 JWT Authentication (Register/Login)
- 👤 User Profile Management
- 🏆 Global Leaderboard
- 💾 MongoDB Score Storage
- 📱 Fully Responsive Design
- 🎨 Cyberpunk Glassmorphism UI
- 🔊 Web Audio API Sound Effects
- ⚡ Fast React + Vite Frontend
- 🚀 REST API powered by Express

---

# 📁 Project Structure

```text
neon-memory/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

---

# 🛠 Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

# ⚙️ Local Development

## Prerequisites

- Node.js (v18 or later)
- MongoDB (Local or Atlas)

---

## Backend Environment

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/neon_memory
JWT_SECRET=cyber_neon_jwt_secret_key
```

---

## Frontend Environment

Create a `.env` file inside the `client` folder.

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/neon-memory.git

cd neon-memory
```

## Install Backend

```bash
cd server
npm install
```

## Install Frontend

```bash
cd ../client
npm install
```

---

# ▶️ Run Locally

### Start Backend

```bash
cd server
npm run dev
```

Runs on:

```
http://localhost:5000
```

### Start Frontend

Open another terminal.

```bash
cd client
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 📡 API Endpoints

All endpoints are prefixed with:

```
/api
```


## 👨‍💻 Author

Developed with ❤️ using React, Node.js, Express, and MongoDB.