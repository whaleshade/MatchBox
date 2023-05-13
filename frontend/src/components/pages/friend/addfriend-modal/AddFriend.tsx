import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import { AiOutlineSearch } from 'react-icons/ai';
import { userState } from '../../../../recoil/locals/login/atoms/atom';
import Popup from '../../../commons/modals/popup-modal/Popup';
import {
  ChatModalMainText as AddModalMainText,
  FormSubmitButton,
} from '../../chat/chat-modal/createroom-modal/Createroom';
import { getImageUrl } from '../../../../api/ProfileImge';
import ErrorPopupNav from '../../../commons/error/ErrorPopupNav';

// 모달 prop 타입
interface Props {
  isAddFriendModal: boolean;
  handleClickModal: () => void;
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

export default function AddFriend({
  isAddFriendModal,
  handleClickModal,
}: Props) {
  // 리액트 쿼리
  const queryClient = useQueryClient();
  const userInfo = useRecoilValue(userState);
  // 에러
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
  }, [isAddFriendModal]);

  // 친구 검색 get
  const handleSearchUserSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      // 유저 검색 결과

      const userData = await axios.get(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/friends/search?nickname=${searchUserNickname}`,
        config,
      );
      // 유저 검색 input 초기화
      setSearchUserNickname('');

      // 이미 추가된 유저일 시 예외 처리
      if (userData.data.isFriend === true) {
        setIsErrorGet(true);
        setErrorMessage('이미 추가되거나 차단된 유저입니다.');
        return;
      }
      setSearchUserResponse(userData.data);

      // 유저 이미지 저장
      const imageUrl = await getImageUrl(userData.data.userId, userInfo.token);
      setUserImageUrl(imageUrl);
    } catch (error) {
      stateReset();
      setIsErrorGet(true);
      setErrorMessage('존재하지 않는 유저이거나, 본인의 닉네임입니다.');
    }
  };

  // 채팅방 친구 초대 post
  const handleInviteSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (searchUserResponse.userId === '') {
      setIsErrorGet(true);
      setErrorMessage('선택된 유저가 없습니다.');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/friends`,
        {
          userId: searchUserResponse.userId,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      // 모달 끄기
      handleClickModal();

      // 친구 목록 쿼리 무효화 및 재요청
      queryClient.invalidateQueries('friends');
    } catch (error) {
      stateReset();
      setIsErrorGet(true);
      setErrorMessage('요청이 실패했습니다.');
    }
  };

  return (
    <div>
      <ErrorPopupNav
        isErrorGet={isErrorGet}
        message={errorMessage}
        handleErrorClose={handleHideErrorModal}
      />
      {isAddFriendModal && (
        <Popup onClose={handleClickModal}>
          <AddModalMainText>친구 추가하기</AddModalMainText>
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
          <AddFriendForm onSubmit={handleInviteSubmit}>
            <FormSubmitButton type="submit">확인하기</FormSubmitButton>
          </AddFriendForm>
        </Popup>
      )}
    </div>
  );
}

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

const AddFriendForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
