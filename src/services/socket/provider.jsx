import { createContext, useContext, useEffect, useState } from "react";
import { EVENTS, connectSocket, disconnectSocket, socket } from "./config";

// Create a new context for the socket functionality
const SocketContext = createContext();

// Create a provider component for the socket functionality
function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connectSocket();

    socket.on(EVENTS.CONNECTION.OPEN, () => {
      setIsConnected(true);
    });

    socket.on(EVENTS.CONNECTION.CLOSE, () => {
      setIsConnected(false);
    });
    return () => {
      socket.off(EVENTS.CONNECTION.OPEN);
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

function useSocket() {
  const { socket, isConnected } = useContext(SocketContext);
  return { socket, isConnected };
}

export { SocketContext, SocketProvider, useSocket };
