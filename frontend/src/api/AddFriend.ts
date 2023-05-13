import axios from 'axios';
import { useMutation } from 'react-query';
import { queryClient } from '../App';

// react-query 친구 추가
export const useAddFriendMutation = (
  channelId: string,
  initailToken: string,
) => {
  return useMutation<void, Error, { userId: string; token: string }>(
    ({ userId, token }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/friends`,
        {
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'userChannels',
          channelId,
          initailToken,
        ]);
      },
    },
  );
};
