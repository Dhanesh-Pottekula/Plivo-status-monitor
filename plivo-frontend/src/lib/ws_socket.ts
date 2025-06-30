import { envDefaults } from "../../envDefaults";

// wsManager.ts
type Listener = (data: any) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;
  private currentRoom: string | null = null;
  private listeners: Listener[] = [];

  connect(): Promise<void> {
    if (this.isConnected) return Promise.resolve();

    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve, reject) => {
        this.socket = new WebSocket(envDefaults.wsUrl);


        this.socket.onopen = () => {
          console.log("✅ WebSocket connected");
          this.isConnected = true;
          resolve();
        };

        this.socket.onerror = (err) => {
          console.error("❌ WebSocket error:", err);
          reject(err);
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.listeners.forEach((cb) => cb(data));
        };

        this.socket.onclose = () => {
          console.log("🔌 WebSocket disconnected");
          this.isConnected = false;
          this.connectionPromise = null;
        };
      });
    }

    return this.connectionPromise;
  }

  joinRoom(room: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    if (this.currentRoom) {
      this.socket.send(JSON.stringify({ action: "leave", room: this.currentRoom }));
    }

    this.socket.send(JSON.stringify({ action: "join", room }));
    this.currentRoom = room;
    console.log(`📡 Joined room: ${room}`);
  }

  leaveRoom() {
    if (this.socket && this.currentRoom) {
      this.socket.send(JSON.stringify({ action: "leave", room: this.currentRoom }));
      console.log(`🚪 Left room: ${this.currentRoom}`);
      this.currentRoom = null;
    }
  }

  addListener(cb: Listener) {
    this.listeners.push(cb);
  }

  removeListener(cb: Listener) {
    this.listeners = this.listeners.filter((fn) => fn !== cb);
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}

const wsManager = new WebSocketManager();
export default wsManager;
