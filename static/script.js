from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from typing import List

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Dark Telegram Style Chat</title>
    <link rel="stylesheet" href="/static/style.css" />
</head>
<body>
    <div class="container" id="login">
        <h2>Enter your name</h2>
        <form id="nameForm">
            <input type="text" id="nameInput" placeholder="Your name" required />
            <button type="submit">Join Chat</button>
        </form>
    </div>

    <div class="container" id="chat" style="display:none;">
        <div id="messages" class="messages"></div>
        <form id="chatForm">
            <input
                type="text"
                id="messageInput"
                placeholder="Type a message..."
                autocomplete="off"
                required
            />
        </form>
    </div>

    <script src="/static/script.js"></script>
</body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
