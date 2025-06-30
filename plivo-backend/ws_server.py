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
    print(f"📤 Broadcasting to room {room}: {rooms}")
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

# Internal listener for Django to send messages to WebSocket server
async def handle_internal(reader, writer):
    try:
        data = await reader.read(1024)
        payload = json.loads(data.decode())
        room = payload["room"]
        message = payload["data"]
        await broadcast(room, message)
        writer.write(b"ok")
        await writer.drain()
    except Exception as e:
        writer.write(str(e).encode())
    finally:
        writer.close()

# Start the internal listener
async def start_internal_listener():
    server = await asyncio.start_server(handle_internal, "localhost", 9000)
    print("📡 TCP listener running at localhost:9000")
    await server.serve_forever()
    
async def main():
    print("🚀 Starting WebSocket server...")
    await asyncio.gather(
        serve(handler, "localhost", 8765),
        start_internal_listener()
    )

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 WebSocket server stopped by user")
    except Exception as e:
        print(f"❌ WebSocket server error: {e}")
