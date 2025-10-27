# QuickPoll - Real-Time Opinion Polling Platform

A real-time polling platform where users can create polls, vote, like polls, and see live updates as other users interact. Built as part of a coding challenge to demonstrate full-stack development skills with modern web technologies.

## Live Demo

Product: https://quick-poll-six.vercel.app/

Video: https://www.loom.com/share/fd6861da488445328356a3d46ad3482a

## System Design and Architecture

### Overview

QuickPoll follows a modern three-tier architecture designed for real-time interactions and scalability on free-tier hosting services.

### Architecture Components

**Frontend Layer (Next.js 14 + TypeScript)**
- Server-side rendering for optimal performance
- Real-time WebSocket connections for live updates
- Responsive UI built with TailwindCSS and shadcn/ui components
- State management for real-time poll data synchronization

**Backend Layer (FastAPI + Python 3.11)**
- Asynchronous REST API for poll management
- WebSocket server for real-time communication
- Connection pooling for database efficiency
- CORS configuration for cross-origin requests

**Data Layer (PostgreSQL)**
- Normalized database schema for polls, options, votes, and likes
- Indexed queries for optimal performance
- Connection pooling to handle concurrent users

### Real-Time Communication Flow

1. **Poll Creation**: Client sends POST request → Backend creates poll → WebSocket broadcasts to all connected clients
2. **Voting**: Client submits vote → Backend updates database → WebSocket sends live vote counts to all clients
3. **Likes**: Client likes poll → Backend increments counter → WebSocket updates like count across all sessions

### Database Schema

```sql
polls: id, title, options (JSONB), votes (JSONB), likes, created_at
comments: id, poll_id, text, likes, created_at
```

### WebSocket Event Types

- `poll_created`: New poll broadcast
- `vote_updated`: Live vote count updates
- `poll_liked`: Like count updates
- `connection_count`: Active user tracking

## How to Run the Project Locally

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL database

### Method 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd QuickPoll

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### Method 2: Manual Setup

#### Database Setup

```bash
# Install PostgreSQL and create database
createdb quickpoll

# Or use Docker for PostgreSQL
docker run --name quickpoll-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=quickpoll -p 5432:5432 -d postgres:15
```

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:password@localhost:5432/quickpoll"

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev

# Access at http://localhost:3000
```

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/quickpoll
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Research and Resources Used

### Technology Research

**Real-Time Polling Platforms Analyzed:**
- Mentimeter: Studied their real-time voting interface and WebSocket implementation patterns
- Poll Everywhere: Analyzed their responsive design and user interaction flows
- Kahoot: Examined their real-time synchronization and user engagement features
- Slido: Researched their poll creation UX and live result visualization

**Open Source Polling Solutions Explored:**
- OpenSlides: Analyzed their PostgreSQL schema design for voting systems
- LimeSurvey: Studied their poll option management and data structures
- Framadate: Examined their minimalist UI approach for poll creation

### APIs and Libraries Used

**Frontend Dependencies:**
- Next.js 14: React framework with SSR capabilities
- TypeScript: Type safety and developer experience
- TailwindCSS: Utility-first CSS framework
- shadcn/ui: Accessible component library built on Radix UI
- Socket.io-client: WebSocket client for real-time communication

**Backend Dependencies:**
- FastAPI: Modern Python web framework with automatic API documentation
- asyncpg: Asynchronous PostgreSQL driver for Python
- python-socketio: WebSocket server implementation
- uvicorn: ASGI server for production deployment
- python-multipart: Form data parsing for file uploads

**Database:**
- PostgreSQL: Chosen for ACID compliance and JSON support for flexible poll options
- Connection pooling: Implemented for handling concurrent connections on free-tier hosting

### Hosting Platform Research

**Free-Tier Hosting Solutions Evaluated:**
- Vercel: Selected for frontend due to excellent Next.js integration and global CDN
- Render: Chosen for backend due to automatic deployments and PostgreSQL support
- Neon: Selected for database due to generous free tier and serverless PostgreSQL
- Railway: Evaluated as alternative for full-stack deployment
- Fly.io: Considered for backend hosting with global edge deployment

### Performance Optimizations

- Implemented connection pooling to handle database connections efficiently
- Used WebSocket connection management to prevent memory leaks
- Optimized database queries with proper indexing
- Implemented client-side caching for poll data
- Used Next.js SSR for improved initial page load times

## API Documentation

### REST Endpoints

- `GET /polls` - Retrieve all polls with vote counts
- `POST /polls` - Create a new poll
- `POST /vote` - Submit a vote for a poll option
- `POST /like` - Like a poll
- `GET /health` - Health check endpoint

### WebSocket Events

- `connect` - Client connection established
- `disconnect` - Client disconnection
- `poll_created` - New poll broadcast
- `vote_updated` - Live vote count updates
- `poll_liked` - Like count updates

## Project Structure

```
QuickPoll/
├── backend/
│   ├── main.py              # FastAPI application and WebSocket handlers
│   ├── database.py          # Database connection and models
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend container configuration
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Main polling interface
│   │   ├── layout.tsx      # Application layout
│   │   ├── globals.css     # Global styles and Tailwind imports
│   │   └── components/     # Reusable UI components
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── next.config.js      # Next.js configuration
│   └── Dockerfile          # Frontend container configuration
├── docker-compose.yml      # Local development environment
└── README.md              # Project documentation
```

## Deployment Configuration

The application is configured for deployment on free-tier services:

- **Frontend**: Deployed on Vercel with automatic deployments from Git (https://quick-poll-six.vercel.app/)
- **Backend**: Deployed on Render with health checks with automatic deployments from Git (https://quickpoll-hfdk.onrender.com)
- **Database**: PostgreSQL hosted on Neon
- **Environment**: Production environment variables configured for cross-origin requests
