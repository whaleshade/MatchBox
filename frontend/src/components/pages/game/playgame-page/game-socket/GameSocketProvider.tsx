import { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import GameSocketContext from './GameSocketContext';

function GameSocketProvider({ children }: any) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const userInfo = useRecoilValue(userState);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_BASE_BACKEND_URL}/game`, {
      path: '/socket.io',
      extraHeaders: {
        authorization: `Bearer ${userInfo.token}`,
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <GameSocketContext.Provider value={socket}>
      {children}
    </GameSocketContext.Provider>
  );
}

export default GameSocketProvider;
