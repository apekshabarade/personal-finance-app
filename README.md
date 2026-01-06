# Personal Finance Management App

Full-stack personal finance tracker built with **Express + MongoDB** on the backend and **React (Vite) + Chart.js** on the frontend.

## Prerequisites
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **MongoDB** - Either:
  - Local MongoDB installation, OR
  - MongoDB Atlas account (free tier works)

## Quick Start Guide

### Step 1: Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

### Step 2: Configure Backend Environment

1. Create a `.env` file in the `backend` folder:
   ```bash
   cd backend
   copy .env.example .env   # Windows
   # OR
   cp .env.example .env      # Mac/Linux
   ```

2. Edit `backend/.env` and set your values:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   
   # For local MongoDB:
   MONGO_URI=mongodb://localhost:27017/personal_finance
   
   # OR for MongoDB Atlas (replace with your connection string):
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/personal_finance
   
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is running on your machine
- Default connection: `mongodb://localhost:27017/personal_finance`

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string and paste it in `.env` as `MONGO_URI`

### Step 4: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

### Step 5: Open the App

Open your browser and go to: **http://localhost:5173**

1. Click "Register" to create a new account
2. Login with your credentials
3. Start adding income and expenses!

## Environment Variables

### Backend (`.env` file):
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `CLIENT_URL` - Frontend URL (default: http://localhost:5173)

### Frontend (optional - `frontend/.env`):
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## App structure
- `backend/server.js` - Express app wiring, routes, middleware
- `backend/models/*` - User, Income, Expense, Investment, Transaction, Budget schemas
- `backend/routes/*` - Auth + CRUD endpoints for income/expense/investment
- `frontend/src` - React app with pages for Login, Register, Dashboard, Add Income/Expense, Analytics

## API overview
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` - current user (Bearer token)
- `GET/POST/PUT/DELETE /api/incomes`
- `GET/POST/PUT/DELETE /api/expenses`
- `GET/POST/PUT/DELETE /api/investments`

Use `Authorization: Bearer <token>` for protected routes.

## Notes
- JWT is stored client-side; axios attaches it to every request.
- Analytics page uses Chart.js for expense categories + monthly trend.

