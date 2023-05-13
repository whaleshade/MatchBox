import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import {
  ChatModalMainText,
  FormSubmitButton,
} from '../createroom-modal/Createroom';
import Popup from '../../../../commons/modals/popup-modal/Popup';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import { useInviteChatRoom } from '../../../../../api/InviteChatRoom';
import ErrorPopupNav from '../../../../commons/error/ErrorPopupNav';

// 모달 prop 타입
interface Props {
  isOpenInviteModal: boolean;
  handleClickModal: () => void;
  channelId: string;
}

// 유저 검색 response 타입
interface SearchUserResponse {
  userId: string;
  nickname: string;
  image: string;
}

// 유저 검색 response 초기값
const initialSearchUserResponse: SearchUserResponse = {
  userId: '',
  nickname: '',
  image: '',
};

export default function Invite({
  isOpenInviteModal,
  handleClickModal,
  channelId,
}: Props) {
  const userInfo = useRecoilValue(userState);
  // 에러 모달
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleHideErrorModal = () => {
    setIsErrorGet(false);
  };

  // 유저 검색 form input 초기화
  const [searchUserNickname, setSearchUserNickname] = useState<string>('');
  // 유저 검색 form input 업데이트
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = event.target;
    setSearchUserNickname(value);
  };

  // 검색된 유저 이미지 초기화
  const [userImgaeUrl, setUserImageUrl] = useState<string>('');

  // 유저 초대 form input 초기화
  const [searchUserResponse, setSearchUserResponse] =
    useState<SearchUserResponse>(initialSearchUserResponse);

  // 모든 state를 초기화하는 함수
  const stateReset = (): void => {
    setSearchUserNickname('');
    setUserImageUrl('');
    setSearchUserResponse(initialSearchUserResponse);
  };

  // 모달이 꺼질 때 state 들을 초기화함
  useEffect(() => {
    stateReset();
  }, [isOpenInviteModal]);

  // 채팅방 친구 검색 get
  const handleSearchUserSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      // 유저 검색 결과
      const userData = await axios.get(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/channels/${channelId}/invite?nickname=${searchUserNickname}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      // 유저 검색 input 초기화
      setSearchUserNickname('');
      // 이미 방에 있는 유저일 시 예외 처리
      if (userData.data.isOnChannel === true) {
        setIsErrorGet(true);
        setErrorMessage('이미 방 안에 있는 유저입니다.');
        return;
      }

      // 초대할 유저 id 저장 -> 이거 웃긴게 아래의 axios가 먼저 돌아서
      // searchUserResponse를 쓰면 에러가 남 -> searchUserResponse.userId = ''임
      setSearchUserResponse(userData.data);

      // 선택된 유저 이미지 get
      const imageUrl = await axios.get(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/account/image?userId=${userData.data.userId}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      // 유저 이미지 저장
      setUserImageUrl(URL.createObjectURL(imageUrl.data));
    } catch (error) {
      stateReset();
      setIsErrorGet(true);
      setErrorMessage('존재하지 않는 유저이거나, 본인의 닉네임입니다.');
    }
  };

  // react-query 채팅방 초대
  const { mutate: inviteChatRoom } = useInviteChatRoom(
    channelId,
    userInfo.token,
  );

  const handleInviteChatRoom = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      if (searchUserResponse.userId === '') {
        setIsErrorGet(true);
        setErrorMessage('선택된 유저가 없습니다.');
        return;
      }
      await inviteChatRoom({
        userId: searchUserResponse.userId,
        token: userInfo.token,
      });
      // 모달 끄기
      handleClickModal();
    } catch (error) {
      stateReset();
      setIsErrorGet(true);
      setErrorMessage('요청을 처리할 수 없습니다.');
    }
  };

  return (
    <div>
      <ErrorPopupNav
        isErrorGet={isErrorGet}
        message={errorMessage}
        handleErrorClose={handleHideErrorModal}
      />
      {isOpenInviteModal && (
        <Popup onClose={handleClickModal}>
          <ChatModalMainText>초대하기</ChatModalMainText>
          <SearchUserForm onSubmit={handleSearchUserSubmit}>
            <SearchUserInput
              type="text"
              name="nickname"
              value={searchUserNickname}
              onChange={handleSearchChange}
              required
            />
            <SearchUserButton>
              <AiOutlineSearch type="submit" />
            </SearchUserButton>
          </SearchUserForm>
          {userImgaeUrl && (
            <SelectedUserContainer>
              <SelectedUserImageWarp>
                <img src={userImgaeUrl} alt="검색된 유저 이미지" />
              </SelectedUserImageWarp>
              <strong>{searchUserResponse.nickname}</strong>
            </SelectedUserContainer>
          )}
          <InviteUserForm onSubmit={handleInviteChatRoom}>
            <FormSubmitButton type="submit">확인하기</FormSubmitButton>
          </InviteUserForm>
        </Popup>
      )}
    </div>
  );
}

export const OpenButton = styled.strong`
  position: absolute;
  top: 3rem;
  right: 0.3rem;
  font-size: 2.5rem;
  color: #c2c2c2;
  cursor: pointer;
  font-weight: bold;
  margin: 1rem;
`;

const SearchUserForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SearchUserInput = styled.input`
  background: #e6e6e6;
  border-radius: 30px;
  border: none;
  margin-left: 0.8rem;
  margin-right: 0.5rem;
`;

const SearchUserButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const SelectedUserContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
`;

const SelectedUserImageWarp = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InviteUserForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
