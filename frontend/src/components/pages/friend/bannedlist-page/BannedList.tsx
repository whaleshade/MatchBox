import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';
import Layout from '../../../commons/layout/Layout';
import Header from '../../../commons/header/Header';
import Footer from '../../../commons/footer/Footer';
import { userState } from '../../../../recoil/locals/login/atoms/atom';
import BanRestoreIcon from '../../../../assets/icon/ban-restore.svg';
import { getImageUrl } from '../../../../api/ProfileImge';
import { footerState } from '../../../../recoil/locals/footer/atoms/footerAtom';
import { isErrorOnGet } from '../../../../recoil/globals/atoms/atom';
import ErrorPopup from '../../../commons/error/ErrorPopup';

interface IBannedBuddy {
  nickname: string;
  image: string;
  status: string;
}

interface IBannedFriends {
  friendId: string;
  buddyId: string;
  buddy: IBannedBuddy;
}

export default function BannedList() {
  const setFooterState = useSetRecoilState(footerState);
  const footer = useRecoilValue(footerState);
  const [bannedFriends, setBannedFriends] = useState<IBannedFriends[]>([]);
  const [restoreClick, setRestoreClicked] = useState<boolean>(false);
  const userInfo = useRecoilValue(userState);
  // 에러
  const [isErrorGet, setIsErrorGet] = useRecoilState(isErrorOnGet);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRestoreClicked = async (friendId: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/friends/${friendId}/banned`,
        {
          isBan: false,
        },
        config,
      );
      setRestoreClicked(true);
    } catch (error) {
      setIsErrorGet(true);
      setErrorMessage('이미 차단이 해제된 친구입니다.');
    }
  };

  const getIamgeUrls = async (friends: IBannedFriends[]) => {
    const urls = await Promise.all(
      friends.map(async friend => {
        const url = await getImageUrl(friend.buddyId, userInfo.token);
        return url;
      }),
    );
    return urls;
  };

  useEffect(() => {
    const setFooter = {
      channels: footer.channels,
      friends: 'ban',
    };
    setFooterState(setFooter);
    const fetchData = async () => {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_BACKEND_URL}/friends/banned`,
          config,
        );
        const friends = response.data.friend;
        const imageUrls = await getIamgeUrls(friends);
        const updatedFriends = friends.map(
          (friend: IBannedFriends, index: number) => {
            return {
              ...friend,
              buddy: {
                ...friend.buddy,
                image: imageUrls[index],
              },
            };
          },
        );
        setBannedFriends(updatedFriends);
      } catch (error) {
        setIsErrorGet(true);
        setErrorMessage('요청이 실패했습니다.');
      }
    };

    fetchData();
  }, []);

  return (
    <Layout
      Header={<Header title="Banned" friendToggle toggleMove={false} />}
      Footer={<Footer tab="friend" />}
    >
      <ErrorPopup message={errorMessage} />
      <Continer>
        <CountContainer>
          <Count>Banned {bannedFriends.length}</Count>
        </CountContainer>
        <ListContainer>
          {bannedFriends.map(bannedFriend => (
            <List key={bannedFriend.friendId}>
              <ImageWrapper>
                <FriendStateBase />
                <FriendState status={bannedFriend.buddy.status} />
                <ProfileImage
                  src={bannedFriend.buddy.image}
                  alt={`${bannedFriend.buddy.nickname}의 이미지`}
                />
              </ImageWrapper>
              <FriendWrapper>
                <FriendNickname>{bannedFriend.buddy.nickname}</FriendNickname>
              </FriendWrapper>
              <ButtonWrapper>
                <RestoreButton
                  onClick={() => handleRestoreClicked(bannedFriend.friendId)}
                >
                  <RestoreImage src={BanRestoreIcon} />
                </RestoreButton>
              </ButtonWrapper>
            </List>
          ))}
        </ListContainer>
      </Continer>
    </Layout>
  );
}

const Continer = styled.div`
  padding: 1.3rem 1.8rem 0rem;
`;

const CountContainer = styled.div`
  display: flex;
  justify-content: left;
`;

const Count = styled.span`
  font-weight: 400;
  font-size: 1.1rem;
  color: #2d3648;
`;

const ListContainer = styled.ul`
  display: flex;
  margin-top: 0;
  flex-direction: column;
  justify-content: left;
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
  justify-content: space-around;
  padding: 1.9rem 0rem 0rem;
  width: 100%;
  height: 6.3rem;
  background-color: #ffffff;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  margin-right: 1rem;
`;

const FriendState = styled.span<{ status: string }>`
  border-radius: 50%;
  width: 0.7rem;
  height: 0.7rem;
  position: absolute;
  top: 3.05rem;
  left: 2.95rem;
  display: block;
  border-radius: 50%;
  width: 0.7rem;
  height: 0.7rem;
  background-color: ${({ status }) =>
    status === 'online'
      ? '#1EB640'
      : status === 'game'
      ? '#DA0D00'
      : status === 'offline'
      ? '#D9D9D9'
      : 'inherit'};
`;

const FriendStateBase = styled.span`
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  position: absolute;
  top: 2.9rem;
  left: 2.8rem;
  display: block;
  border-radius: 50%;
  background-color: white;
`;

const FriendWrapper = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
  padding: 0rem 2rem 0rem;
`;

const FriendNickname = styled.span`
  font-size: 1.6rem;
  font-weight: 400;
  color: #2d3648;
  text-decoration: none;
  color: inherit;
`;

const RestoreImage = styled.img`
  width: 5rem;
`;

const RestoreButton = styled.button`
  background: transparent;
  border: none;
  padding: 0rem 0rem 0rem;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
