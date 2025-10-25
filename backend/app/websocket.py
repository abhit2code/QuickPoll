from fastapi import WebSocket, WebSocketDisconnect
from typing import List
import json
import asyncio

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        if not self.active_connections:
            return
            
        print(f"Broadcasting to {len(self.active_connections)} connections")
        disconnected = []
        
        for connection in self.active_connections[:]:  # Create a copy to iterate
            try:
                await asyncio.wait_for(connection.send_text(message), timeout=1.0)
            except Exception as e:
                print(f"Connection failed, removing: {e}")
                disconnected.append(connection)
        
        # Remove failed connections
        for conn in disconnected:
            self.disconnect(conn)

    def cleanup_dead_connections(self):
        """Remove connections that are no longer active"""
        active = []
        for conn in self.active_connections:
            if conn.client_state.value == 1:  # CONNECTED state
                active.append(conn)
        
        removed = len(self.active_connections) - len(active)
        if removed > 0:
            print(f"Cleaned up {removed} dead connections")
            
        self.active_connections = active

manager = ConnectionManager()
