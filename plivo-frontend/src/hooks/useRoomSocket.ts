// useRoomSocket.ts
import { useEffect } from "react";
import wsManager from "@/lib/ws_socket";
import { onRoomSocketMessage } from "@/_helpers/socket-redux-mapping";

export const useRoomSocket = (room: string, onMessage?: (data: any) => void) => {
  useEffect(() => {
    let mounted = true;

    wsManager.connect().then(() => {
      if (!mounted) return;
      wsManager.joinRoom(room);
      wsManager.addListener(onMessage||onRoomSocketMessage);
    });

    return () => {
      mounted = false;
      wsManager.leaveRoom();
      wsManager.removeListener(onMessage||onRoomSocketMessage);
    };
  }, [room]);
};
