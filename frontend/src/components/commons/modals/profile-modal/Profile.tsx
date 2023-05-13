import React from 'react';
import styled from 'styled-components';
import ExitIcon from '../../../../assets/icon/profile-modal-exit.svg';
import ProfileFooter from './ProfileFooter';

export interface Member {
  userId: string;
  intraId: string;
  nickname: string;
  image: string;
  isMute: boolean;
}

// 채팅방 멤버 state 초기값
export const initialMember: Member = {
  userId: '',
  intraId: '',
  nickname: '',
  image: '',
  isMute: false,
};

interface BanProps {
  friendId: string;
  isBan: boolean;
}

interface ChannelProps {
  channelId?: string;
  isAdmin?: boolean;
}

export interface UserProps {
  userId: string;
  intraId: string;
  nickname: string;
  image: string;
  isMute?: boolean;
  ban?: BanProps;
}

interface Props {
  handleClickModal: () => void;
  user: UserProps;
  inChat: boolean;
  channelInfo?: ChannelProps;
  handleKickClicked?: (targetId: string) => void | undefined;
}

export default function Profile({
  handleClickModal,
  user,
  inChat,
  channelInfo,
  handleKickClicked,
}: Props) {
  return (
    user && (
      <Container>
        <Inner>
          <MainWrap>
            <UserDataContainer>
              <ExitButton src={ExitIcon} onClick={handleClickModal} />
              <ProfileContainer>
                <ProfileImage>
                  <img src={user.image} alt="검색된 유저 이미지" />
                </ProfileImage>
                <NicknameContainer>{user.nickname}</NicknameContainer>
                <IntraContainer>{user.intraId}</IntraContainer>
              </ProfileContainer>
            </UserDataContainer>
          </MainWrap>
          <FooterWrap>
            <ProfileFooter
              handleClickModal={handleClickModal}
              user={user}
              inChat={inChat}
              channelInfo={{
                channelId: channelInfo?.channelId,
                isAdmin: channelInfo?.isAdmin,
              }}
              handleKickClicked={handleKickClicked}
            />
          </FooterWrap>
        </Inner>
      </Container>
    )
  );
}

const NicknameContainer = styled.div`
  font-family: 'NanumGothic';
  font-style: normal;
  font-weight: 700;
  font-size: 3.2rem;
  line-height: 2rem;
  color: #2d3648;
  padding: 3.7rem 0rem 0rem;
  text-align: center;
`;

const IntraContainer = styled.div`
  font-family: 'NanumGothic';
  font-style: normal;
  font-weight: 700;
  font-size: 2rem;
  line-height: 2rem;
  color: #2d3648;
  padding: 2rem 0rem 0rem;
  text-align: center;
`;

const ProfileContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.div`
  background-color: #1eb640;
  width: 23.6rem;
  height: 23.6rem;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.2rem 3.2rem 0rem;
  height: 100%;
  position: relative;
`;

const ExitButton = styled.img`
  margin: 10px;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 2px;
`;

const Container = styled.div`
  width: 412px;
  max-height: 915px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transform: translate(-50%, 0%);
  position: fixed;
  top: 0%;
  left: 50%;
  grid-template-areas:
    'main'
    'footer';
  border-top: none;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;

  z-index: 10000;
`;

export const HeaderWrap = styled.header`
  grid-area: nav;
`;

export const MainWrap = styled.main`
  grid-area: main;
  width: 100%;
  height: 90%;
`;

export const FooterWrap = styled.footer`
  grid-area: footer;
  width: 100%;
  /* height: 10%; */

  display: flex;
  justify-content: center;
  align-items: center;
`;
