import os
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware


from app.database import init_db
from app.routers import polls, websocket
from app.websocket import manager

app = FastAPI(title="QuickPoll API", version="1.0.0")

# app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://quick-poll-six.vercel.app",
        "http://localhost:3000",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.add_middleware(
#     TrustedHostMiddleware,
#     allowed_hosts=["quickpoll-production.up.railway.app", "localhost"]
# )

@app.on_event("startup")
async def startup():
    try:
        await init_db()
    except Exception as e:
        print(f"Database initialization failed: {e}")
        # Continue startup anyway

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
