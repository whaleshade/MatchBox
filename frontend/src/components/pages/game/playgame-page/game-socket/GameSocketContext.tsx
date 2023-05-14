import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useGameSocket = () => {
  return useContext(SocketContext);
};

export default SocketContext;
