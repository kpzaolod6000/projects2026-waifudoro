# Animedoro

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
animedoro/
├── frontend/   # React + Vite SPA
├── backend/    # Express REST API
└── docs-backend/
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Or run everything with Docker:

```bash
cd backend
npm run docker:up
```

## Design

See [DESIGN.md](./DESIGN.md) for the full visual design system, color palette, typography, and component guidelines.
