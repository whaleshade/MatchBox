import { useAxiosWithToken } from '.';

// 예시
export function useGetFriendList() {
  const AxiosInstance = useAxiosWithToken();
  return AxiosInstance.get(`/friends`);
}
