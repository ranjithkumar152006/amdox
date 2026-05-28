# Amdox ERP (Full Stack)

Amdox ERP is a full-stack ERP application with:

- `erp-frontend`: React + Vite + Tailwind UI
- `amdox-erp/backend`: Node.js + Express + MongoDB API

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS, Chart.js
- **Backend:** Node.js, Express, Mongoose, JWT auth, CORS
- **Database:** MongoDB (local or Atlas)

## Project Structure

```text
.
├─ erp-frontend/
└─ amdox-erp/
   └─ backend/
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

### 1) Backend setup

```bash
cd "amdox-erp/backend"
npm install
```

Create `.env` from `.env.example`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/amdox-erp
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

### 2) Frontend setup

```bash
cd "erp-frontend"
npm install
```

## Run the app

Run backend and frontend in separate terminals.

### Terminal 1: Backend

```bash
cd "amdox-erp/backend"
npm run dev
```

Backend API base URL: `http://localhost:5000/api`  
Health check: `http://localhost:5000/api/health`

### Terminal 2: Frontend

```bash
cd "erp-frontend"
npm run dev
```

Frontend URL (default Vite): `http://localhost:5173`

## Optional Commands

### Backend

```bash
npm start       # run server without nodemon
npm run seed    # reset + seed database with mock data
```

### Frontend

```bash
npm run build   # production build
npm run preview # preview built app
npm run lint    # run eslint
```

## Notes

- Frontend API client currently points to `http://localhost:5000/api`.
- Keep backend running before using dashboard/API-driven pages.
- If login is seeded, the UI hints demo users:
  - `admin@erp.com`
  - `hr@erp.com`
  - `finance@erp.com`

## Team Members

- Member 1: Ranjith kumar.A
- Member 2: Yuvedha.d

