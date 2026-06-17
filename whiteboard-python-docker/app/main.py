from pathlib import Path
import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Collaborative Whiteboard")

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
async def get_index():
    return FileResponse(STATIC_DIR / "index.html")

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"Client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast_text(self, message: str, sender: WebSocket):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()


@app.websocket("/whiteboardendpoint")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            message = await websocket.receive_text()

            try:
                data = json.loads(message)

                required_keys = {"shape", "color", "coords"}
                if not required_keys.issubset(data.keys()):
                    await websocket.send_text(
                        json.dumps({
                            "type": "error",
                            "message": "Invalid message format."
                        })
                    )
                    continue

                await manager.broadcast_text(message, sender=websocket)  

            except json.JSONDecodeError:  
                await websocket.send_text(
                    json.dumps({
                        "type": "error",
                        "message": "Message is not valid JSON."
                    })
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket)