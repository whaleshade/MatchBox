import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { channelIdState } from '../../../../../recoil/locals/chat/atoms/atom';
import { PublicToggleButton } from './PublicToggleButton';
import Popup, { XButton } from '../../../../commons/modals/popup-modal/Popup';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import ErrorPopupNav from '../../../../commons/error/ErrorPopupNav';

// 모달 prop 타입
interface Props {
  isOpenCreateRoomModal: boolean;
  handleClickModal: () => void;
}

// 모달 form input 타입
interface FormValues {
  channelName: string;
  password: string;
}

// 모달 form input 초기값
const initialFormValues: FormValues = {
  channelName: '',
  password: '',
};

// 채팅방 생성 모달
export default function CreateRoom({
  isOpenCreateRoomModal,
  handleClickModal,
}: Props) {
  // 페이지 이동
  const navigate = useNavigate();
  // 채널 id atom setter
  const setChannelIdState = useSetRecoilState(channelIdState);
  const userInfo = useRecoilValue(userState);

  // form input 초기화
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  // form input 업데이트
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };
  // 토글 상태 관리
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const handleClick = () => {
    setIsPublic(!isPublic);
  };
  // 에러 모달
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleHideErrorModal = () => {
    setIsErrorGet(false);
    handleClickModal();
  };

  // 모달이 꺼질 때 state 들을 초기화함
  useEffect(() => {
    setFormValues(initialFormValues);
    setIsPublic(false);
  }, [isOpenCreateRoomModal]);

  // 채팅방 생성 Post
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/channels`,
        {
          channelName: formValues.channelName,
          password: formValues.password,
          isPublic,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      // 모달 끄기
      handleClickModal();
      // 채널 id 설정
      setChannelIdState(response.data.channelId);
      // 채팅방으로 페이지 이동
      const to = `/chat/channel/${response.data.channelId}`;
      navigate(to);
    } catch (error) {
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
      {isOpenCreateRoomModal && (
        <Popup onClose={handleClickModal}>
          <ChatModalMainText>채널 만들기</ChatModalMainText>
          <FormDiv>
            <FormWarp>
              <FormContainer onSubmit={handleSubmit}>
                <FormText>채팅방 이름</FormText>
                <FormInput
                  type="text"
                  name="channelName"
                  value={formValues.channelName}
                  onChange={handleChange}
                  placeholder="채팅방 이름을 설정합니다"
                  required
                />
                <RoomTypeContainer>
                  <RoomTypeText>비공개/공개</RoomTypeText>
                  <PublicToggleButton
                    isPublic={isPublic}
                    onClick={handleClick}
                    type="button"
                  />
                </RoomTypeContainer>
                <FormText>비밀번호 설정</FormText>
                <FormInput
                  type="text"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 설정합니다"
                />
                <ChatFormInfoText>
                  * 비밀번호를 설정하지 않으려면 빈칸으로 두세요
                </ChatFormInfoText>
                <ChatFormInfoText>
                  * 비밀번호는 다시 찾을 수 없으니 잘 기억해주세요
                </ChatFormInfoText>
                <FormSubmitButton type="submit">제출하기</FormSubmitButton>
              </FormContainer>
            </FormWarp>
          </FormDiv>
        </Popup>
      )}
    </div>
  );
}

export const ChatModalMainText = styled.p`
  padding-top: 1rem;
  font-size: 1.5rem;
  font-weight: bolder;
`;

export const FormDiv = styled.div`
  border-radius: 1.6rem;
  background-color: #f4f4f4;
  width: 80%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormWarp = styled.div`
  padding: 0.7rem 0px;
  width: 87%;
`;

export const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FormText = styled.p`
  font-size: 1rem;
  align-self: flex-start;
  padding-left: 0.2rem;
`;

export const FormInput = styled.input`
  font-size: 1rem;
  align-self: flex-start;
  border: 1px solid #f4f4f4;
  border-radius: 8px;
  width: 100%;
`;

const RoomTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RoomTypeText = styled.p`
  font-size: 1rem;
  align-self: flex-start;
  margin-bottom: 0;
  padding-left: 0.2rem;
  padding-right: 1.5rem;
`;

export const ChatFormInfoText = styled.p`
  margin-bottom: 0px;
  margin-top: 8px;
  color: #b5b1b1e1;
  align-self: flex-start;
  font-size: 0.8rem;
`;

export const FormSubmitButton = styled.button`
  font-family: 'NanumGothic';
  font-weight: bold;
  margin-top: 1rem;
  align-self: center;
  width: 7rem;
  color: white;
  background: #313c7a;
  border-radius: 20px;
  border: none;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 7px;
  cursor: pointer;
`;
