import axios from 'axios';
import { useMutation } from 'react-query';
import { queryClient } from '../App';

// react-query 게임 구매
export const useBuyGameMutation = (initailToken: string) => {
  return useMutation<void, Error, { gameId: string; token: string }>(
    ({ gameId, token }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/games/${gameId}/buy`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['games', initailToken]);
      },
    },
  );
};
