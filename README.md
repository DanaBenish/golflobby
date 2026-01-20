# Golf Lobby

A web application for managing golf course tee times and player lobbies. Browse golf courses, select tee times, and join groups with other players.

## Live Demo

🔗 [https://danabenish.github.io/golflobby](https://danabenish.github.io/golflobby)

## Features

- Browse available golf courses
- View course details and tee times
- Join tee time lobbies (up to 4 players per group)
- Real-time player list updates

## Tech Stack

**Frontend:**

- React + Vite
- React Router
- Deployed on GitHub Pages

**Backend:**

- FastAPI (Python)
- SQLite database

## Local Development

**Frontend:**

```bash
cd golf-lobby-frontend
npm install
npm run dev
```

**Backend:**

```bash
cd backend
pip install fastapi uvicorn
uvicorn server:app --reload --port 3003
```
