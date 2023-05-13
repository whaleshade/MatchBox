import React from 'react';
import styled from 'styled-components';
import { IBuddy, IFriendDetail } from '..';

const Base = styled.li`
  display: flex;
  align-items: start;
  width: 100%;
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
  cursor: pointer;
`;

const NickName = styled.span`
  font-size: 1.6rem;
  margin-left: 2rem;
  margin-top: 1rem;
  display: inline-block;
  vertical-align: middle;
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

interface Prop {
  imageUrl: string;
  nickName: string;
  status: string;
  buddy: IFriendDetail;
  onClickCapture: (buddy: IFriendDetail) => void;
}

export default function FriendDetailList({
  imageUrl,
  nickName,
  status,
  buddy,
  onClickCapture,
}: Prop) {
  return (
    <Base>
      <ImageWrapper>
        <FriendStateBase />
        <FriendState status={status} />
        <ProfileImage
          src={imageUrl}
          alt={`${nickName}의 이미지`}
          onClick={() => onClickCapture(buddy)}
        />
      </ImageWrapper>
      <NickName>{nickName}</NickName>
    </Base>
  );
}
