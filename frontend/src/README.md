# Markdown Notes App

A full-stack notes application with live Markdown preview.

## Tech Stack
- Frontend: React, react-markdown, axios
- Backend: Node.js, Express
- Database: SQLite (via sqlite3)

## Setup

### Prerequisites
- Node.js v18+

### Backend
```bash
cd backend
npm install
node server.js
```
Server runs at http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm start
```
App opens at http://localhost:3000

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notes | List all notes |
| GET | /notes/:id | Get single note |
| POST | /notes | Create note |
| PUT | /notes/:id | Update note |
| DELETE | /notes/:id | Delete note |