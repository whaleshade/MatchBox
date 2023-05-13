import axios from 'axios';
import { useQuery } from 'react-query';

interface Game {
  gameId: string;
  name: string;
  price: number;
  isPlayable: boolean;
  isBuy: boolean;
}

const getGames = async (token: string) => {
  const res = await axios.get<Game[]>(
    `${process.env.REACT_APP_BASE_BACKEND_URL}/games`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

export const useGames = (token: string) => {
  return useQuery(['games', token], () => getGames(token));
};
