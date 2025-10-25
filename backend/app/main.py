from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import polls, websocket
from app.websocket import manager

app = FastAPI(title="QuickPoll API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.get("/connections")
async def get_connections():
    manager.cleanup_dead_connections()
    return {"active_connections": len(manager.active_connections)}

app.include_router(polls.router)
app.include_router(websocket.router)
