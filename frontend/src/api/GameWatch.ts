import axios from 'axios';
import { useQuery } from 'react-query';

export interface GameWatch {
  gameWatchId: string;
  currentViewer: number;
  userGameId1: string;
  userGameId2: string;
}

const getGameWatchForReady = async (gameWatchId: string, token: string) => {
  const res = await axios.get<GameWatch>(
    `${process.env.REACT_APP_BASE_BACKEND_URL}/games/gameWatch/${gameWatchId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

export const useGameWatchForReady = (gameWatchId: string, token: string) => {
  return useQuery(['gameWatchForReady', token], () =>
    getGameWatchForReady(gameWatchId, token),
  );
};
