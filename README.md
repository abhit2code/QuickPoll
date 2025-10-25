# QuickPoll - Real-Time Opinion Polling Platform

A real-time polling platform where users can create polls, vote, like polls, and see live updates as other users interact.

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: FastAPI (Python 3.11) + WebSockets
- **Database**: PostgreSQL
- **Real-time**: WebSocket connections for live updates

## Features

- Create polls with multiple options
- Real-time voting with live result updates
- Like polls functionality
- Responsive UI with progress bars
- WebSocket-based real-time updates
- PostgreSQL data persistence

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone and navigate to project
cd quickpoll

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### Manual Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL database
# Create database 'quickpoll' with user 'user' and password 'password'

# Set environment variable
export DATABASE_URL="postgresql://user:password@localhost:5432/quickpoll"

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3000
```

## API Endpoints

- `POST /polls` - Create a new poll
- `GET /polls` - Get all polls
- `POST /vote` - Submit a vote
- `POST /like` - Like a poll
- `WS /ws` - WebSocket connection for real-time updates

## Deployment

### Free Tier Hosting Options

**Backend (FastAPI)**:
- Railway.app
- Render.com
- Fly.io

**Frontend (Next.js)**:
- Vercel (recommended)
- Netlify
- Railway.app

**Database**:
- Neon.tech (PostgreSQL)
- Supabase
- Railway.app PostgreSQL

### Environment Variables

Backend:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

Frontend:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Project Structure

```
quickpoll/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend container
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Main polling interface
│   │   ├── layout.tsx      # App layout
│   │   └── globals.css     # Global styles
│   ├── package.json        # Node dependencies
│   └── Dockerfile          # Frontend container
├── docker-compose.yml      # Local development setup
└── README.md              # This file
```

## Real-time Features

The application uses WebSocket connections to provide real-time updates:

- **New Poll Creation**: Instantly appears for all users
- **Vote Updates**: Live vote counts and percentages
- **Like Updates**: Real-time like counters

## Performance Considerations

- Minimal database queries with efficient indexing
- WebSocket connection management for scalability
- Optimized frontend with React state management
- Responsive design for mobile and desktop
