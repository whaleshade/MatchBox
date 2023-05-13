import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQueryClient } from 'react-query';
import { isErrorOnGet } from '../../../../../recoil/globals/atoms/atom';
import ErrorPopup from '../../../../commons/error/ErrorPopup';
import { getImageUrl } from '../../../../../api/ProfileImge';
import { channelIdState } from '../../../../../recoil/locals/chat/atoms/atom';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import {
  useGetMyChannels,
  IMyChannels,
  IUserWrapper,
} from '../../../../../api/Channel';

export default function MyMsgList() {
  // 리액트 쿼리
  const queryClient = useQueryClient();
  const [channels, setChannels] = useState<IMyChannels[]>([]);
  const [myChannelId, setMyChannelId] = useRecoilState(channelIdState);
  const [isErrorGet, setIsErrorGet] = useRecoilState(isErrorOnGet);
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userState);
  const handleError = (error: AxiosError) => {
    if (error.response) {
      setIsErrorGet(true);
    }
  };
  const { data: myChannelLists } = useGetMyChannels(handleError);

  useEffect(() => {
    setIsErrorGet(false);
    if (myChannelLists) {
      const updateMyChannelList = async () => {
        await Promise.all(
          myChannelLists.channel.map(async (channel: IMyChannels) => {
            channel.owner.ownerImage = await getImageUrl(
              channel.owner.ownerId,
              userInfo.token,
            );
          }),
        );
        setChannels([...myChannelLists.channel]);
      };
      updateMyChannelList();
    }
    // queryClient.invalidateQueries('getMyChannels');
  }, [myChannelLists]);

  const handleClick = (channelId: string) => {
    setMyChannelId(channelId);
    navigate(`/chat/channel/${channelId}`);
    queryClient.invalidateQueries('getMyChannels');
  };

  return (
    <>
      <ErrorPopup message="요청을 처리할 수 없습니다." />
      <Outline>
        {channels.map((room: IMyChannels) => (
          <List
            key={room.userChannel.userChannelId}
            onClick={() => handleClick(room.userChannel.channel.channelId)}
          >
            <RoomItem>
              <RoomMain>
                <RoomContent>
                  <ProfileImg>
                    <img
                      src={room.owner.ownerImage}
                      alt="profile"
                      width="100%"
                      height="100%"
                    />
                  </ProfileImg>
                  <RoomBody>
                    <RoomTitle>
                      {room.userChannel.channel.channelName}
                    </RoomTitle>
                    <RoomMemeber>
                      {room.user.map(
                        (user: IUserWrapper, userIndex: number) => {
                          if (userIndex < 2) {
                            return (
                              <Member key={user.user.userId}>
                                {user.user.nickname}
                              </Member>
                            );
                          }
                          if (userIndex === 2) {
                            return (
                              <Member key={user.user.userId}>
                                외 {room.userChannel.channel.count - 2}명
                              </Member>
                            );
                          }
                          return null;
                        },
                      )}
                    </RoomMemeber>
                  </RoomBody>
                </RoomContent>
                <RoomInfo>
                  <LastMsgTime as="span">
                    {new Date(room.chat.time).toISOString().split('T')[0]}
                  </LastMsgTime>
                  <UnreadMsgCount
                    style={{
                      backgroundColor:
                        room.chat.computedChatCount === 0 ? 'white' : 'red',
                    }}
                  >
                    <Unread>{room.chat.computedChatCount}</Unread>
                  </UnreadMsgCount>
                </RoomInfo>
              </RoomMain>
            </RoomItem>
          </List>
        ))}
      </Outline>
    </>
  );
}

const Outline = styled.ul`
  display: flex;
  margin-top: 0;
  flex-direction: column;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  gap: 0;
  height: inherit;
  overflow-y: auto;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10rem;
  background-color: #ffffff;
  border: 1px solid #d8d8d8;
`;

const RoomItem = styled.li`
  width: 100%;
  justify-content: space-between;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  cursor: pointer;
`;

const RoomMain = styled.div`
  display: flex;
  width: 100%;
  text-align: start;
  margin-right: 2rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  justify-content: space-between;
`;

const ProfileImg = styled.div`
  width: 5rem;
  height: 5rem;
  background-color: #ad4545;
  border-radius: 2.5rem;
  overflow: hidden;
  margin-left: 1rem;
  margin-right: 3.5rem;
`;

const RoomTitle = styled.div`
  font-size: 1.5rem;
  color: #000000;
  text-decoration: none;
  color: inherit;
  text-align: left;
`;

const RoomMemeber = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 1.2rem;
  color: #000000;
  text-decoration: none;
  color: inherit;
  text-align: left;
  margin-top: 1rem;
`;

const Member = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-right: 0.5rem;
`;

const RoomContent = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 0.5rem;
`;

const RoomBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  width: 20%;
`;

const LastMsgTime = styled.div`
  font-size: 0.5rem;
  color: #797171;
  text-decoration: none;
`;

const UnreadMsgCount = styled.div`
  font-size: 1rem;
  color: white;
  text-decoration: none;
  border-radius: 1rem;
  margin-top: 1rem;
`;

const Unread = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  margin: 0.5rem;
  border-radius: 50%;
`;
