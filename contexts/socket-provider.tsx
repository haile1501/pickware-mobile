import { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageConfig } from "@/constants/config";

export const WebsocketContext = createContext<Socket | undefined>(undefined);

interface WebsocketProviderProps {
  children: React.ReactNode;
}

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const fetchTokenAndConnect = async () => {
      const token = await AsyncStorage.getItem(AsyncStorageConfig.accessToken); // Fetch token from AsyncStorage
      const newSocket = io("http://localhost:4000", {
        extraHeaders: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      });
      setSocket(newSocket);
    };

    fetchTokenAndConnect();

    return () => {
      socket?.disconnect(); // Clean up on unmount
    };
  }, []);

  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
}
