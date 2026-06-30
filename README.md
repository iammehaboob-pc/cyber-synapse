# Neon Memory // Cyberpunk Match Game

**Neon Memory** is a sleek, production-ready, full-stack browser-based Memory Card Game featuring a futuristic cyberpunk aesthetic. Built with React (Vite) on the frontend, Node.js and Express on the backend, and MongoDB for statistics storage. The project features JWT session authentication, responsive glassmorphism styles, synth-synthesized sound effects via the Web Audio API, and real-time score/leaderboard management.

---

## Folder Structure

```
neon-memory/
├── client/                 # React Client Frontend
│   ├── public/             # Static Assets
│   ├── src/
│   │   ├── assets/         # UI resources & icons
│   │   ├── components/     # Reusable UI Elements (Loader, Toast, Navbar)
│   │   ├── hooks/          # Custom hooks (useAudio sound engine)
│   │   ├── pages/          # Pages (Game, Leaderboard, Login, Register, Profile)
│   │   ├── services/       # Axios API layer configurations
│   │   ├── App.jsx         # Routing controller and token checker
│   │   ├── index.css       # Complete layout, themes, variables & animations
│   │   └── main.jsx        # Bootstrap script mounting App
│   ├── index.html          # Web shell hosting Rajdhani/Orbitron fonts
│   ├── vite.config.js      # Vite compilation config
│   └── package.json        # Frontend configuration and packages
│
└── server/                 # Node.js/Express Backend Server
    ├── config/             # DB settings (db.js connection)
    ├── controllers/        # Logical controllers (authController, userController)
    ├── middleware/         # Custom guards (auth.js token validation)
    ├── models/             # Schema models (User.js database representation)
    ├── routes/             # Path mapping (api.js routing table)
    ├── server.js           # Server application bootstrapper
    └── package.json        # Server configuration and packages
```

---

## Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally (default: `mongodb://localhost:27017/neon_memory`) or a MongoDB Atlas connection string.

### 2. Configuration Settings

#### Backend Environment Settings
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/neon_memory
JWT_SECRET=cyber_neon_jwt_secret_key
```

#### Frontend Environment Settings
Create a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation Commands

#### Backend Installation:
Navigate to the `server/` folder and install dependencies:
```bash
cd server
npm install
```

#### Frontend Installation:
Navigate to the `client/` folder and install dependencies:
```bash
cd ../client
npm install
```

### 4. Running the Project Locally

#### Launch Backend Server:
Start the Express server in development hot-reload mode:
```bash
cd server
npm run dev
```
The server will boot up at `http://localhost:5000`.

#### Launch Frontend Client:
Start the React development server in a separate terminal:
```bash
cd client
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## API Reference Map

All paths are prefixed with `/api`.

### Authentication:
- `POST /register` - Registers a new player. Expects `{ username, email, password }`.
- `POST /login` - logs in an existing player. Expects `{ email, password }`. Returns JWT.

### Player & Game Statistics:
- `GET /leaderboard` - Public. Fetches top 10 users ranked by `highestScore` descending.
- `GET /profile` - Protected. Returns profile stats for the logged-in user.
- `PUT /profile` - Protected. Updates credentials (username, email, and/or password).
- `POST /save-score` - Protected. Sends stats after a game. Expects `{ score, outcome: 'win' | 'lose' }`.
- `DELETE /account` - Protected. Deletes the player account permanently from the database.

---

## Production Deployment Guide

### 1. Database (MongoDB Atlas)
1. Register for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Shared Cluster, select a region, and choose **M0 (Free)** instance type.
3. Under **Database Access**, create a user credentials set (username and password).
4. Under **Network Access**, whitelist connection IP addresses (allow `0.0.0.0/30` for server hosting compatibility).
5. Retrieve your connection string from the **Connect** wizard (select Driver: Node.js). It will look like:
   `mongodb+srv://<username>:<password>@cluster.mongodb.net/neon_memory?retryWrites=true&w=majority`
   Replace `<username>` and `<password>` with your database credentials.

### 2. Backend Server (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/) and click **New > Web Service**.
3. Link your GitHub repository.
4. Set the following configuration settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Go to the **Environment** tab and add your keys:
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (A strong random signature string)
   - `PORT`: `5000`
6. Click **Deploy Web Service**. Render will generate a public URL (e.g. `https://neon-memory-api.onrender.com`).

### 3. Frontend Client (Vercel)
1. Sign in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Select your GitHub repository.
3. Configure project settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add the API pointer:
   - `VITE_API_URL`: `https://neon-memory-api.onrender.com/api` (Point to your Render deployment URL with the `/api` prefix)
5. Click **Deploy**. Vercel compiles the build and hosts your frontend publicly.
