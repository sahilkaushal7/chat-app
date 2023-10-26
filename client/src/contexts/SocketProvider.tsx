import * as React from "react";

import io from 'socket.io-client'

export const SocketContext = React.createContext<any>({} as any);

interface ISocketProvider {
  children: React.ReactNode;
  id: string;
  name: string;
}

export const SocketProvider: React.FC<ISocketProvider> = ({ children, id, name }) => {
  const [socket, setSocket] = React.useState<any>();

  React.useEffect(() => {
    const newSocket = io("http://localhost:5000", { query: { id, name } });
    setSocket(newSocket);

    return () => newSocket.close() as any;
  }, [id, name]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return React.useContext(SocketContext);
};
