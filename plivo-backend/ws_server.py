import asyncio
import json
from websockets.server import serve, WebSocketServerProtocol
from typing import Dict, Set

rooms: Dict[str, Set[WebSocketServerProtocol]] = {}

async def handler(websocket: WebSocketServerProtocol):
    joined_rooms = set()
    print("✅ New client connected")

    try:
        async for msg in websocket:
            try:
                data = json.loads(msg)
                action = data.get("action")
                room = data.get("room")

                if action == "join" and room:
                    print(f"📥 Joining room: {room}")
                    rooms.setdefault(room, set()).add(websocket)
                    joined_rooms.add(room)

                elif action == "leave" and room:
                    print(f"🚪 Leaving room: {room}")
                    if room in rooms:
                        rooms[room].discard(websocket)
                        joined_rooms.discard(room)

                elif action == "message" and room:
                    message = data.get("data", "")
                    print(f"📤 Message to room {room}: {message}")
                    await broadcast(room, {
                        "room": room,
                        "message": message
                    })

            except json.JSONDecodeError:
                await websocket.send(json.dumps({ "error": "Invalid JSON" }))

    except Exception as e:
        print(f"❌ Client disconnected unexpectedly: {e}")

    finally:
        for room in joined_rooms:
            rooms[room].discard(websocket)
        print("🔌 Client disconnected")

async def broadcast(room: str, data: dict):
    if room not in rooms:
        return
    message = json.dumps(data)
    dead = set()
    for ws in rooms[room]:
        try:
            await ws.send(message)
        except:
            dead.add(ws)
    rooms[room] -= dead

async def main():
    async with serve(handler, "localhost", 8765):
        print("✅ WebSocket server running at ws://localhost:8765/")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
