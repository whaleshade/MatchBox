import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import FriendDetailList from './FriendDetailList';
import { useGetFriendList } from '../../../../../api/Friends';
import { getImageUrl } from '../../../../../api/ProfileImge';
import { IBuddy, IFriendDetail, IFriends } from '..';
import Profile, {
  UserProps,
} from '../../../../commons/modals/profile-modal/Profile';

const Base = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2.4rem;
  border-top: 1px solid #d3d3d3;
`;

const FriendCount = styled.span`
  display: flex;
  justify-content: start;
  font-size: 1.1rem;
  margin-top: 1.3rem;
  margin-left: 1.8rem;
`;

const FriendWrapper = styled.div`
  margin-top: 1.9rem;
  margin-left: 1.8rem;
  display: flex;
  flex-direction: column;
`;

const Friend = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 0;
  width: 100%;
  > li + li {
    margin-top: 2.5rem;
  }
`;

export default function FriendDetail() {
  const userInfo = useRecoilValue(userState);
  const { data: friendListsData, isLoading, isError } = useGetFriendList();
  const [buddies, setBuddies] = useState<Array<IFriendDetail>>([]);
  const [friendCount, setFriendCount] = useState<number>(0);
  const [isOpenProfileModal, setIsOpenProfileModal] = useState<boolean>(false);
  const handleClickProfileModal = async () => {
    setIsOpenProfileModal(!isOpenProfileModal);
  };
  const [selectedFriend, setSelectedFriend] = useState<UserProps | null>();
  const [selectedFriendList, setSelectedFriendList] = useState<IBuddy | null>();

  const handleSelectFrined = async (friend: IFriendDetail) => {
    setSelectedFriendList(friend);
    const friends: UserProps = {
      userId: friend.buddyId,
      intraId: friend.intraId,
      nickname: friend.nickname,
      image: friend.image,
      ban: {
        isBan: friend.isBan,
        friendId: friend.friendId,
      },
    };

    setSelectedFriend(friends);
    setIsOpenProfileModal(true);
  };

  useEffect(() => {
    if (friendListsData && friendListsData.friends) {
      const updatedFriendLists = async () => {
        const newFriendLists: IFriendDetail[] = await Promise.all(
          friendListsData.friends.map(async (data: IFriends) => {
            const imageUrl = await getImageUrl(data.buddyId, userInfo.token);
            return {
              nickname: data.buddy.nickname,
              intraId: data.buddy.intraId,
              status: data.buddy.status,
              buddyId: data.buddyId,
              friendId: data.friendId,
              isBan: data.isBan,
              image: imageUrl,
            };
          }),
        );
        setBuddies(newFriendLists);
        setFriendCount(friendListsData.friends.length);
      };
      updatedFriendLists();
    }
  }, [friendListsData]);

  return (
    <Base>
      {isOpenProfileModal && selectedFriend && (
        <Profile
          handleClickModal={handleClickProfileModal}
          user={selectedFriend}
          inChat={false}
        />
      )}
      <FriendCount>Friends {friendCount}</FriendCount>
      <FriendWrapper>
        <Friend>
          {buddies.map((data: IFriendDetail) => (
            <FriendDetailList
              key={data.buddyId}
              imageUrl={data.image}
              nickName={data.nickname}
              status={data.status}
              buddy={data}
              onClickCapture={handleSelectFrined}
            />
          ))}
        </Friend>
      </FriendWrapper>
    </Base>
  );
}
