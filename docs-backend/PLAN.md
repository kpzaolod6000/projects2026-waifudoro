# Animedoro — Backend Implementation Plan

> **Stack:** Node.js · TypeScript · Express · MongoDB Native Driver · Docker
> **Audience:** Claude Core or any backend developer implementing the server-side logic for the Animedoro frontend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Authentication & Access Control](#2-authentication--access-control)
3. [Folder Structure](#3-folder-structure)
4. [Database Collections (MongoDB Native)](#4-database-collections-mongodb-native)
5. [API Endpoints](#5-api-endpoints)
6. [Business Logic & Validations](#6-business-logic--validations)
7. [Middleware](#7-middleware)
8. [Docker Setup](#8-docker-setup)
9. [Environment Variables](#9-environment-variables)
10. [Integration Steps](#10-integration-steps)

---

## 1. Project Overview

Animedoro is a gamified Pomodoro productivity app. Users complete focus sessions (work / short break / long break), earn XP, level up, manage tasks, track statistics, and interact with an AI waifu companion (Hina).

### Pages & Access Matrix

| Route         | Guest (no account) | Authenticated user |
|---------------|--------------------|--------------------|
| `/timer`      | ✅ Timer only (no WaifuSidebar, no StatsRow) | ✅ Full page |
| `/tasks`      | ❌ Redirect to `/login` | ✅ Full access |
| `/statistics` | ❌ Redirect to `/login` | ✅ Full access |
| `/chat`       | ❌ Redirect to `/login` | ✅ Full access |
| `/settings`   | ❌ Redirect to `/login` | ✅ Full access |
| `/login`      | ✅ Public | Redirect to `/timer` |
| `/register`   | ✅ Public | Redirect to `/timer` |

**Timer page for guests:** Only `TimerCard` + `TimerTabs` are rendered. `WaifuSidebar`, `StatsRow`, and the full `MainLayout` sidebar navigation are hidden. A banner encourages guests to sign up.

---

## 2. Authentication & Access Control

### Strategy
- **JWT** (JSON Web Tokens) for stateless auth.
- **Access Token:** 15 minutes expiry, stored in React memory (context).
- **Refresh Token:** 7 days expiry, stored as an `httpOnly` cookie.
- **Password hashing:** `bcryptjs` with salt rounds = 12.

### Token Payload
```ts
interface JwtPayload {
  sub: string;   // userId (MongoDB ObjectId as string)
  email: string;
}
```

### Route Protection
- **Public routes:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/sessions/timer/config`.
- **Protected routes:** All other `/api/*` routes require `Authorization: Bearer <accessToken>`.

---

## 3. Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts              # Zod-validated env vars
│   │   └── db.ts               # MongoDB native client singleton
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── error.middleware.ts # Global error handler
│   │   └── validate.middleware.ts # Zod request validation
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schema.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.routes.ts
│   │   ├── tasks/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.routes.ts
│   │   │   └── tasks.schema.ts
│   │   ├── sessions/
│   │   │   ├── sessions.controller.ts
│   │   │   ├── sessions.service.ts
│   │   │   ├── sessions.routes.ts
│   │   │   └── sessions.schema.ts
│   │   ├── statistics/
│   │   │   ├── statistics.controller.ts
│   │   │   ├── statistics.service.ts
│   │   │   └── statistics.routes.ts
│   │   ├── waifu/
│   │   │   ├── waifu.controller.ts
│   │   │   ├── waifu.service.ts
│   │   │   ├── waifu.routes.ts
│   │   │   └── waifu.schema.ts
│   │   └── chat/
│   │       ├── chat.controller.ts
│   │       ├── chat.service.ts
│   │       ├── chat.routes.ts
│   │       └── chat.schema.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── xp.ts
│   │   ├── streak.ts
│   │   └── response.ts
│   ├── app.ts
│   └── server.ts
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 4. Database Collections (MongoDB Native)

No ORM — plain MongoDB driver (`mongodb` npm package). Each document shape is described below.

### `users`
```ts
{
  _id: ObjectId,
  email: string,           // unique index
  username: string,        // unique index
  passwordHash: string,
  avatarUrl: string | null,
  level: number,           // default 1
  xpCurrent: number,       // default 0
  xpToNextLevel: number,   // default 1000
  totalXp: number,         // default 0
  streak: number,          // default 0
  lastActiveDate: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

### `userSettings`
```ts
{
  _id: ObjectId,
  userId: ObjectId,          // ref → users, unique index
  workDuration: number,      // default 25 (minutes)
  shortBreakDuration: number,// default 5
  longBreakDuration: number, // default 15
  sessionsUntilLongBreak: number, // default 4
  notificationSound: boolean,// default true
  theme: 'light' | 'dark',  // default 'light'
}
```

### `tasks`
```ts
{
  _id: ObjectId,
  userId: ObjectId,          // ref → users, indexed
  title: string,
  tags: string[],            // default []
  estimatedPomodoros: number,// default 1
  completed: boolean,        // default false
  completedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

### `pomodoroSessions`
```ts
{
  _id: ObjectId,
  userId: ObjectId,          // ref → users, indexed
  type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK',
  durationMin: number,
  xpEarned: number,          // 50 for WORK, 0 for breaks
  taskId: ObjectId | null,   // optional ref → tasks
  completedAt: Date,
}
```

### `waifuStatus`
```ts
{
  _id: ObjectId,
  userId: ObjectId,          // unique index
  name: string,              // default 'Hina'
  happiness: number,         // 0–100, default 50
  energy: number,            // 0–100, default 100
  imageUrl: string,
}
```

### `chatMessages`
```ts
{
  _id: ObjectId,
  userId: ObjectId,          // indexed
  isUser: boolean,           // true = user msg, false = waifu reply
  message: string,
  createdAt: Date,
}
```

### `refreshTokens`
```ts
{
  _id: ObjectId,
  userId: ObjectId,          // indexed
  token: string,             // unique index
  expiresAt: Date,
  revoked: boolean,          // default false
  createdAt: Date,
}
```

### Recommended MongoDB Indexes
```js
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.userSettings.createIndex({ userId: 1 }, { unique: true })
db.tasks.createIndex({ userId: 1 })
db.pomodoroSessions.createIndex({ userId: 1, completedAt: -1 })
db.waifuStatus.createIndex({ userId: 1 }, { unique: true })
db.chatMessages.createIndex({ userId: 1, createdAt: 1 })
db.refreshTokens.createIndex({ token: 1 }, { unique: true })
db.refreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index
```

---

## 5. API Endpoints

Base URL: `http://localhost:4000/api`

### 5.1 Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login, returns access + sets refresh cookie |
| `POST` | `/auth/refresh` | Public (cookie) | Issue new access token |
| `POST` | `/auth/logout` | Protected | Revoke refresh token |

**POST /auth/register — Body**
```json
{ "username": "Alex_Kun", "email": "alex@example.com", "password": "SecurePass123!" }
```

**POST /auth/login — Response 200**
```json
{
  "accessToken": "<jwt>",
  "leveledUp": false,
  "user": { "id": "...", "username": "Alex_Kun", "email": "...", "level": 1, "xpCurrent": 0, "streak": 0 }
}
```

---

### 5.2 Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/users/me` | Protected | Get current user profile |
| `PATCH` | `/users/me` | Protected | Update username, email, avatarUrl |
| `PATCH` | `/users/me/password` | Protected | Change password |
| `GET` | `/users/me/settings` | Protected | Get timer/app settings |
| `PATCH` | `/users/me/settings` | Protected | Update settings |

---

### 5.3 Tasks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/tasks` | Protected | List tasks (`?completed=false/true`) |
| `POST` | `/tasks` | Protected | Create task |
| `PATCH` | `/tasks/:id` | Protected | Update task |
| `PATCH` | `/tasks/:id/toggle` | Protected | Toggle completion + award XP |
| `DELETE` | `/tasks/:id` | Protected | Delete task |

**POST /tasks — Body**
```json
{ "title": "Finish UI", "tags": ["Development"], "estimatedPomodoros": 2 }
```

---

### 5.4 Sessions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/sessions` | Protected | Record completed session + award XP |
| `GET` | `/sessions` | Protected | List sessions (`?from=&to=`) |
| `GET` | `/sessions/timer/config` | Public | Default/personal timer durations |

**POST /sessions — Body**
```json
{ "type": "WORK", "durationMin": 25, "taskId": "optional-id" }
```

**POST /sessions — Response 201**
```json
{
  "session": { "id": "...", "type": "WORK", "xpEarned": 50 },
  "user": { "level": 1, "xpCurrent": 50, "xpToNextLevel": 1000, "leveledUp": false }
}
```

---

### 5.5 Statistics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/statistics/summary` | Protected | Aggregated stats |
| `GET` | `/statistics/weekly` | Protected | Daily sessions for current week |
| `GET` | `/statistics/xp-history` | Protected | Cumulative XP over time |

**GET /statistics/summary — Response 200**
```json
{
  "totalPomodoros": 128, "totalHoursFocused": 53.5,
  "missionsCompleted": 89, "successRate": 92,
  "currentStreak": 12, "bestStreak": 15,
  "level": 15, "xpCurrent": 650, "xpToNextLevel": 1000, "xpEarnedToday": 450
}
```

---

### 5.6 Waifu

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/waifu/status` | Protected | Get waifu happiness, energy, streak |
| `POST` | `/waifu/interact` | Protected | Trigger a waifu event |

**POST /waifu/interact — Body**
```json
{ "event": "SESSION_COMPLETED" }
```
Valid events: `SESSION_COMPLETED` · `TASK_COMPLETED` · `STREAK_BROKEN` · `DAILY_LOGIN`

---

### 5.7 Chat

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/chat/history` | Protected | Get last N messages (`?limit=50`) |
| `POST` | `/chat/message` | Protected | Send message, get waifu reply |
| `DELETE` | `/chat/history` | Protected | Clear chat history |

---

## 6. Business Logic & Validations

### 6.1 XP & Leveling

```
WORK session completed:  +50 XP
Task completed:          +100 XP
Daily login:             +20 XP

Level N → N+1 threshold: 1000 + (N - 1) * 200 XP
```

Loop until `xpCurrent < xpToNextLevel`, subtracting threshold and incrementing level each iteration.

### 6.2 Streak Logic

Run on every `POST /sessions` and every login:
1. If `lastActiveDate` is **today** → no change.
2. If `lastActiveDate` is **yesterday** → `streak += 1`.
3. If older or null → `streak = 1`.
Always update `lastActiveDate` to today.

### 6.3 Waifu Stat Deltas

| Event | happiness | energy |
|-------|-----------|--------|
| `SESSION_COMPLETED` | +5 | -10 |
| `TASK_COMPLETED` | +10 | 0 |
| `STREAK_BROKEN` | -20 | -10 |
| `DAILY_LOGIN` | 0 | +20 |

All values clamped to `[0, 100]`.

### 6.4 Input Validations (Zod)

- **register:** email valid, username 3–30 chars alphanumeric+underscore, password min 8 chars with uppercase + digit.
- **tasks:** title 1–200 chars, tags array max 5 (each max 30 chars), estimatedPomodoros 1–20.
- **sessions:** type enum `WORK|SHORT_BREAK|LONG_BREAK`, durationMin 1–120.
- **settings:** durations integers within safe ranges, theme `light|dark`.

### 6.5 Task Ownership Check

Before any mutation on a task, verify `task.userId.toString() === req.user.id`. Throw `403 Forbidden` if mismatch.

---

## 7. Middleware

### `auth.middleware.ts`
Reads `Authorization: Bearer <token>`, verifies with `JWT_SECRET`, attaches `req.user = { id, email }`.

### `validate.middleware.ts`
Factory function — takes a Zod schema, returns Express middleware that parses `req.body` and returns `422` with field errors on failure.

### `error.middleware.ts`
Last middleware registered. Handles `AppError` subclasses (`NotFoundError`, `ForbiddenError`, `UnauthorizedError`, `ConflictError`, `ValidationError`) with their correct status codes. Falls through to `500` for unexpected errors.

### CORS
Allow `CORS_ORIGIN` env var (default `http://localhost:5173`) with `credentials: true`.

### Rate Limiting (`express-rate-limit`)
- `/auth/login`: 10 req / 15 min / IP
- `/auth/register`: 5 req / hour / IP

---

## 8. Docker Setup

### `Dockerfile` (multi-stage)
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 4000
CMD ["node", "dist/server.js"]
```

### `docker-compose.yml`
```yaml
version: '3.9'
services:
  mongodb:
    image: mongo:7.0
    container_name: animedoro_mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: animedoro
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

  backend:
    build: { context: ., dockerfile: Dockerfile }
    container_name: animedoro_backend
    restart: unless-stopped
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      NODE_ENV: production
      PORT: 4000
      CORS_ORIGIN: ${CORS_ORIGIN}
    ports:
      - "4000:4000"

volumes:
  mongo_data:
networks:
  default:
    driver: bridge
```

### `.dockerignore`
```
node_modules
dist
.env
.env.*
!.env.example
*.log
.git
coverage/
```

---

## 9. Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# MongoDB
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=supersecretpassword
DATABASE_URL="mongodb://admin:supersecretpassword@mongodb:27017/animedoro?authSource=admin"

# JWT — min 32 chars each
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 10. Integration Steps

### Step 1 — Install dependencies
```bash
cd backend
npm install
```

### Step 2 — MongoDB connection
`src/config/db.ts` exports `connectDB()` (call once in `server.ts`) and `getDB()` (use anywhere in services).

### Step 3 — Create indexes on first boot
Add an `initIndexes()` function called after `connectDB()`:
```ts
async function initIndexes() {
  const db = getDB();
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('userSettings').createIndex({ userId: 1 }, { unique: true });
  await db.collection('tasks').createIndex({ userId: 1 });
  await db.collection('pomodoroSessions').createIndex({ userId: 1, completedAt: -1 });
  await db.collection('waifuStatus').createIndex({ userId: 1 }, { unique: true });
  await db.collection('chatMessages').createIndex({ userId: 1, createdAt: 1 });
  await db.collection('refreshTokens').createIndex({ token: 1 }, { unique: true });
  await db.collection('refreshTokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}
```

### Step 4 — Run with Docker
```bash
cp .env.example .env   # fill JWT_SECRET, JWT_REFRESH_SECRET, MONGO_ROOT_PASSWORD
npm run docker:up      # starts MongoDB + backend
```

### Step 5 — Run locally (dev)
```bash
# MongoDB must be running (locally or via Docker)
npm run dev
```

### Step 6 — Frontend Integration
1. Create `AuthContext` in React storing the `accessToken` in memory.
2. Add `PrivateRoute` wrapper in React Router — redirect to `/login` when no token.
3. Timer page guest mode: when unauthenticated, render only `TimerCard` + `TimerTabs` with a "Sign in to unlock all features" banner.
4. Set `VITE_API_URL=http://localhost:4000/api` in the frontend `.env`.

---

## Quick Reference: HTTP Status Codes

| Status | Meaning |
|--------|---------|
| `200` | OK |
| `201` | Created |
| `204` | No Content |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `409` | Conflict (duplicate email/username) |
| `422` | Validation Error |
| `429` | Rate Limited |
| `500` | Internal Server Error |

---

*Animedoro v1.0 — March 2026*
