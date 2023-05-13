import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSocket } from '../../playgame-page/game-socket/GameSocketContext';
import { NoXPopup } from '../../../../commons/modals/popup-modal/Popup';

interface Props {
  handleClickModal: () => void;
}

export default function Matching({ handleClickModal }: Props) {
  const navigate = useNavigate();
  const socketRef = useSocket();

  useEffect(() => {
    socketRef?.once(
      'randomMatchSuccess',
      (gameWatchId: { gameWatchId: string }) => {
        navigate(`/game/${gameWatchId.gameWatchId}/ready`);
        handleClickModal();
      },
    );

    return () => {
      socketRef?.off('randomMatchSuccess');
    };
  });

  const cancelRandomMatch = () => {
    socketRef?.emit('cancelRandomMatch');
    handleClickModal();
  };

  return (
    <NoXPopup onClose={cancelRandomMatch}>
      <MainText>매칭 중...</MainText>
      <CancelButton onClick={cancelRandomMatch}>취소</CancelButton>
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
