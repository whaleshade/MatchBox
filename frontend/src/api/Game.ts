import { UseQueryOptions, useQueries, useQuery } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useAxiosWithToken } from '.';
import { IGameInfo, IGameWatch } from '../components/pages/game/watchgame-page';

export const useGetGameWatchList = (
  gameId: string | undefined,
  onError: (error: AxiosError) => void,
  isEnabled: boolean,
) => {
  const axiosInstance = useAxiosWithToken();

  const queryOptions: UseQueryOptions<IGameWatch, AxiosError> = {
    queryFn: async () => {
      const response: AxiosResponse<IGameWatch> = await axiosInstance.get(
        `/games/${gameId}`,
      );
      return response.data;
    },
    onError: error => onError(error),
    retry: 0, // 바로 실패로 처리하려면 시도 횟수를 0으로 설정
    enabled: isEnabled, // 여기에 enabled 속성을 추가합니다.
  };

  return useQuery<IGameWatch, AxiosError>(['gameWatch', gameId], queryOptions);
};

export const useGetGameList = () => {
  const axiosInstance = useAxiosWithToken();

  return useQuery('GameList', async () => {
    const response: AxiosResponse<IGameInfo[]> = await axiosInstance.get(
      `/games/`,
    );
    return response.data;
  });
};
