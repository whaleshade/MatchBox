import axios from 'axios';
import { useMutation } from 'react-query';
import { queryClient } from '../App';

// react-query 채팅방 초대
export const useInviteChatRoom = (channelId: string, initailToken: string) => {
  return useMutation<void, Error, { userId: string; token: string }>(
    ({ userId, token }) =>
      axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/channels/${channelId}/invite`,
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
