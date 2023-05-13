import { useQuery } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useGetFriendList } from './Friends';

interface IFriend {
  friendId: string;
  buddyId: string;
  buddy: {
    nickname: string;
    intraId: string;
    status: string;
    image: string;
  };
}

// 코드 복붙해서 테스트해보세요
// 코드를 테스트하기 전에 api폴더에 index.ts에 토큰을 넣어야 합니다
// 그래야 서버 401 안 뜹니다
export default function Example() {
  const { data: friends, isLoading, isError } = useGetFriendList();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {isError}</div>;

  console.log(friends);

  return <div>브라우저를 켜서 콘솔에서 데이터가 제대로 오는 지 확인하세요</div>;
}
