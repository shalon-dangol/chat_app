# Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js), featuring JWT authentication, Socket.IO messaging, and persistent chat history.

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, bcryptjs
**Frontend:** React, JavaScript, Tailwind CSS, Socket.IO Client, Vite

## Features

- User registration and login with JWT authentication
- Real-time messaging via Socket.IO
- Persistent chat history stored in MongoDB
- Paginated message fetching
- Live stats (total users, total messages)
- Protected routes with auth middleware
- Responsive UI with Tailwind CSS

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Thin request/response handlers
│   │   ├── services/       # Business logic, DB queries, Socket handlers
│   │   ├── models/         # Mongoose schemas (User, Message)
│   │   ├── routes/         # Express route definitions
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/          # DB connection, response helpers
│   │   └── index.js        # Server entry point
│   ├── .env.example        # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page layouts (Login, Register, Chat)
│   │   ├── services/       # API calls, Socket setup
│   │   ├── context/        # Auth state management
│   │   ├── App.jsx         # Route definitions
│   │   └── main.jsx        # Entry point
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone and install dependencies

```bash
# Backend
cd backend
cp .env.example .env    # Edit with your MongoDB URI and JWT secret
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — edit `backend/.env`:

| Variable         | Description                              | Default                                        |
|------------------|------------------------------------------|------------------------------------------------|
| `PORT`           | Server port                              | `5000`                                         |
| `MONGODB_URI`    | MongoDB connection string                | `mongodb://localhost:27017/chat_app`           |
| `JWT_SECRET`     | Secret key for JWT signing               | (required)                                     |
| `JWT_EXPIRES_IN` | Token expiration duration                | `7d`                                           |

**Frontend** (optional) — create `frontend/.env` if you need custom URLs:

| Variable         | Description                              | Default                                        |
|------------------|------------------------------------------|------------------------------------------------|
| `VITE_API_URL`   | Backend REST API base URL                | `http://localhost:5000/api`                    |
| `VITE_SOCKET_URL`| Backend Socket.IO server URL             | `http://localhost:5000`                        |

### 3. Start the servers

```bash
# Terminal 1 — Backend (runs on http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

### 4. Open the app

Navigate to `http://localhost:5173` in your browser.

## API Endpoints

### Authentication

| Method | Endpoint              | Body                                | Auth |
|--------|-----------------------|-------------------------------------|------|
| POST   | `/api/auth/register`  | `{ username, email, password }`     | No   |
| POST   | `/api/auth/login`     | `{ email, password }`               | No   |

### Users

| Method | Endpoint              | Body                    | Auth |
|--------|-----------------------|-------------------------|------|
| GET    | `/api/users`          | —                       | Yes  |
| GET    | `/api/users/:id`      | —                       | Yes  |
| PUT    | `/api/users/:id`      | `{ username?, email? }` | Yes  |
| DELETE | `/api/users/:id`      | —                       | Yes  |

### Messages

| Method | Endpoint              | Query Params        | Auth |
|--------|-----------------------|---------------------|------|
| GET    | `/api/messages`       | `limit`, `skip`     | Yes  |
| GET    | `/api/messages/stats` | —                   | Yes  |

### Health Check

| Method | Endpoint        | Auth |
|--------|-----------------|------|
| GET    | `/api/health`   | No   |

## Socket.IO Events

| Event              | Direction    | Payload                          | Description                    |
|--------------------|--------------|----------------------------------|--------------------------------|
| `send_message`     | Client→Server| `{ content }`                    | Send a new message             |
| `new_message`      | Server→Client| `{ _id, sender, content, ... }`  | Broadcast saved message        |
| `user_joined`      | Server→Client| `{ username, message }`          | Notify when a user connects    |

## License

ISC

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for available configuration.
