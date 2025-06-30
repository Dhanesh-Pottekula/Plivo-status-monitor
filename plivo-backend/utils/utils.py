# websockets/utils.py
import socket
import json

def send_to_ws(room: str, data: dict):
    try:
        payload = json.dumps({"room": room, "data": data})
        with socket.create_connection(("localhost", 9000), timeout=2) as s:
            s.sendall(payload.encode())
            response = s.recv(1024)
            print(f"📨 WebSocket server response: {response.decode()}")
    except Exception as e:
        print(f"❌ Failed to send to WebSocket server: {e}")
