# WaifuDoro

A gamified Pomodoro productivity app with an anime aesthetic. Complete focus sessions, earn XP, and level up your character.

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS        |
| Backend  | Node.js, Express, TypeScript, MongoDB           |
| Auth     | JWT (HTTP-only cookies)                         |
| Infra    | Docker, Docker Compose                          |

## Project Structure

```
waifudoro/
├── frontend/   # React + Vite SPA
└── backend/    # Express REST API + MongoDB
```

## Getting Started with Docker

The frontend and backend each have their own `docker-compose.yml` and are started **separately**.

### 1. Backend (API + MongoDB)

```bash
cd backend

# Copy and configure environment variables
cp .env.example .env
# Edit .env — set MONGO_ROOT_PASSWORD, JWT_SECRET, JWT_REFRESH_SECRET at minimum

# Start MongoDB + backend API
docker compose up --build -d
```

Backend API will be available at **http://localhost:4000**

### 2. Frontend

```bash
cd frontend

# Start the dev server
docker compose up --build
```

Frontend will be available at **http://localhost:5173**

### Stopping Services

```bash
# Backend
cd backend && docker compose down

# Frontend
cd frontend && docker compose down

# Backend + remove database volume
cd backend && docker compose down -v
```

## Environment Variables (backend `.env`)

| Variable                   | Description                             | Default                 |
|----------------------------|-----------------------------------------|-------------------------|
| `PORT`                     | API server port                         | `4000`                  |
| `MONGO_ROOT_USER`          | MongoDB root username                   | `admin`                 |
| `MONGO_ROOT_PASSWORD`      | MongoDB root password                   | *(required)*            |
| `MONGO_ROOT_DATABASE`      | MongoDB initial database name           | *(required)*            |
| `DATABASE_URL`             | Full MongoDB connection string          | *(required)*            |
| `JWT_SECRET`               | Access token secret (min 32 chars)      | *(required)*            |
| `JWT_REFRESH_SECRET`       | Refresh token secret (min 32 chars)     | *(required)*            |
| `JWT_EXPIRES_IN`           | Access token lifetime                   | `15m`                   |
| `JWT_REFRESH_EXPIRES_IN`   | Refresh token lifetime                  | `7d`                    |
| `CORS_ORIGIN`              | Allowed frontend URL                    | `http://localhost:5173` |
| `ANTHROPIC_API_KEY`        | Optional — Claude AI for waifu chat     |                         |

## Local Development (without Docker)

### Backend

```bash
cd backend
npm install
npm run dev   # ts-node-dev with hot reload on port 4000
```

Requires a running MongoDB instance and a configured `.env` file.

### Frontend

```bash
cd frontend
npm install
npm run dev   # Vite dev server on port 5173
```

## Design

See [DESIGN.md](./DESIGN.md) for the full visual design system, color palette, typography, and component guidelines.
