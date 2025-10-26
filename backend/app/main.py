import os
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import polls, websocket
from app.websocket import manager

app = FastAPI(title="QuickPoll API", version="1.0.0")

# Railway handles HTTPS termination - no redirect needed

# Production-ready CORS settings
allowed_origins = [
    "https://*.vercel.app",  # Vercel deployments
    "http://localhost:3000",  # Local development
    "http://localhost:8000",  # Local backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "QuickPoll API is running", "status": "ok"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected"
    }

@app.get("/connections")
async def get_connections():
    manager.cleanup_dead_connections()
    return {"active_connections": len(manager.active_connections)}

app.include_router(polls.router)
app.include_router(websocket.router)
