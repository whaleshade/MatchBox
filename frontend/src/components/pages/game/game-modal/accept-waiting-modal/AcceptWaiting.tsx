import styled from 'styled-components';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoXPopup } from '../../../../commons/modals/popup-modal/Popup';
import { useSocket } from '../../../login/login-page/LoginSocketContext';

interface Props {
  handleClickModal: () => void;
  buddyId: string;
}

export default function AcceptWaiting({ handleClickModal, buddyId }: Props) {
  const navigate = useNavigate();
  const socketRef = useSocket();

  useEffect(() => {
    // 초대 취소 성공
    socketRef?.once('inviteCancelSuccess', () => {
      handleClickModal();
    });

    // 초대 보낸 사람이 게임 초대 수락해서 게임 페이지로 이동함
    socketRef?.once(
      'goGameReadyPage',
      (gameWatchId: { gameWatchId: string }) => {
        navigate(`/game/${gameWatchId.gameWatchId}/ready`);
        handleClickModal();
      },
    );

    return () => {
      socketRef?.off('inviteCancelSuccess');
      socketRef?.off('goGameReadyPage');
    };
  });

  return (
    <NoXPopup
      onClose={() => {
        socketRef?.emit('inviteCancel', { userId: buddyId });
      }}
    >
      <MainText>초대 수락 대기 중...</MainText>
      <CancelButton
        onClick={() => {
          socketRef?.emit('inviteCancel', { userId: buddyId });
        }}
      >
        취소
      </CancelButton>
    </NoXPopup>
  );
}

const MainText = styled.p`
  padding-top: 1rem;
  margin: 20px 0;
  color: #3f4d97;
  font-size: 2rem;
  font-weight: bold;
`;

const CancelButton = styled.button`
  font-family: 'NanumGothic';
  font-weight: 700;
  font-size: 1.2rem;
  align-self: center;
  width: 10rem;
  color: white;
  background: #313c7a;
  border-radius: 20px;
  border: none;
  margin-bottom: 10px;
  padding: 7px;
  cursor: pointer;
`;
