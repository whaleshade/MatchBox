import { UseQueryOptions, useQuery } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useAxiosWithToken } from '.';
import { IFriend } from '../components/pages/friend/friendlist-page';
import { IGameHistoryByAPI } from '../components/pages/game/watchgame-page';

export const useGetFriendList = () => {
  const axiosInstance = useAxiosWithToken();

  return useQuery<IFriend, AxiosError>('friends', async () => {
    const response: AxiosResponse<IFriend> = await axiosInstance.get(
      '/friends',
    );
    return response.data;
  });
};

export const useGetGameHistory = (
  userId: string | undefined,
  gameName: string | null,
  onError: (error: AxiosError) => void,
  isEnabled: boolean,
) => {
  const axiosInstance = useAxiosWithToken();

  const queryOptions: UseQueryOptions<IGameHistoryByAPI, AxiosError> = {
    queryFn: async () => {
      const response: AxiosResponse<IGameHistoryByAPI> =
        await axiosInstance.get(`/friends/${userId}/history?game=${gameName}`);
      return response.data;
    },
    onError: error => onError(error),
    retry: 0, // 바로 실패로 처리하려면 시도 횟수를 0으로 설정
    enabled: isEnabled,
  };

  return useQuery<IGameHistoryByAPI, AxiosError>(
    ['GameHistory', gameName, userId],
    queryOptions,
  );
};
