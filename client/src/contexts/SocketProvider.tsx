import * as React from "react";
import io from 'socket.io-client'


export const SocketContext = React.createContext<any>({} as any);

interface ISocketProvider {
  children: React.ReactNode;
  id: string;
}

export const SocketProvider: React.FC<ISocketProvider> = ({ children, id }) => {
  const [socket, setSocket] = React.useState<any>();

  React.useEffect(() => {
    const newSocket = io("http://localhost:5000", { query: { id } });
    setSocket(newSocket);

    return () => newSocket.close() as any;
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return React.useContext(SocketContext);
};
