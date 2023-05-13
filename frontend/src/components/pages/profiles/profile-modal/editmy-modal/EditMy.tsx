import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import Popup from '../../../../commons/modals/popup-modal/Popup';
import {
  FormContainer,
  FormDiv,
  FormInput,
  FormSubmitButton,
  FormText,
  FormWarp,
} from '../../../chat/chat-modal/createroom-modal/Createroom';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import ErrorPopupNav from '../../../../commons/error/ErrorPopupNav';

// 모달 prop 타입
interface Props {
  isOpenEditProfileModal: boolean;
  handleClickModal: () => void;
}

export const fileToBase64 = (
  file: File,
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export default function EditMy({
  isOpenEditProfileModal,
  handleClickModal,
}: Props) {
  // 유저 정보
  const [userInfo, setUserInfo] = useRecoilState(userState);
  // 에러
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleHideErrorModal = () => {
    setIsErrorGet(false);
  };

  // 선택된 파일, 이미지 초기화
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  // nickname input 초기화
  const [nickname, setNickname] = useState<string>('');
  // nickname input 업데이트
  const handleNicknameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = event.target;
    setNickname(value);
  };

  useEffect(() => {
    setSelectedFile(null);
    setPreviewUrl('');
    setNickname('');
  }, [isOpenEditProfileModal]);

  // 프로필 수정 patch
  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let updateImageUrl;
      // 이미지 업데이트
      if (selectedFile) {
        updateImageUrl = await fileToBase64(selectedFile);
        const form = new FormData();
        form.append('image', selectedFile!);
        const user = await axios.patch(
          `${process.env.REACT_APP_BASE_BACKEND_URL}/account/image`,
          form,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
      }
      // 닉네임 업데이트
      if (nickname) {
        const user = await axios.patch(
          `${process.env.REACT_APP_BASE_BACKEND_URL}/account/nickname`,
          {
            nickname,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
      }
      const newUserInfo = {
        ...userInfo,
        imageUrl: updateImageUrl || userInfo.imageUrl,
        nickname: nickname || userInfo.nickname,
      };
      setUserInfo(newUserInfo);
      // 모달 끄기
      handleClickModal();
    } catch (error) {
      setIsErrorGet(true);
      setErrorMessage('중복된 닉네임입니다.');
    }
  };

  return (
    <div>
      <ErrorPopupNav
        isErrorGet={isErrorGet}
        message={errorMessage}
        handleErrorClose={handleHideErrorModal}
      />
      {isOpenEditProfileModal && (
        <Popup onClose={handleClickModal}>
          <EditMyMainText>프로필 수정</EditMyMainText>
          <FormDiv>
            <FormWarp>
              <FormContainer onSubmit={handleEditSubmit}>
                <SelectImageContainer>
                  {previewUrl ? (
                    <SelectImageWrap>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%' }}
                      />
                    </SelectImageWrap>
                  ) : (
                    <SelectImageWrap>
                      <img
                        src={userInfo.imageUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%' }}
                      />
                    </SelectImageWrap>
                  )}
                  <SelectImageInputWrapper>
                    <SelectImageInput
                      type="file"
                      onChange={handleFileInputChange}
                    />
                    사진 선택
                  </SelectImageInputWrapper>
                </SelectImageContainer>
                <FormText>닉네임 수정</FormText>
                <FormInput
                  type="text"
                  name="channelName"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임을 수정합니다"
                />
                <FormSubmitButton type="submit">저장</FormSubmitButton>
              </FormContainer>
            </FormWarp>
          </FormDiv>
        </Popup>
      )}
    </div>
  );
}

const EditMyMainText = styled.p`
  padding-top: 1rem;
  color: #3f4d97;
  font-size: 2rem;
  font-weight: bold;
`;

const SelectImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectImageWrap = styled.div`
  margin-top: 15px;
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SelectImageInputWrapper = styled.label`
  font-family: 'NanumGothic';
  font-size: 1.4rem;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 1rem;
  width: 9rem;
  color: white;
  background: #6d77af;
  border-radius: 15px;
  cursor: pointer;
`;

const SelectImageInput = styled.input`
  display: none;
`;
