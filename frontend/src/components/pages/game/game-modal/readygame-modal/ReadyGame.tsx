import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import { useSocket } from '../../playgame-page/game-socket/GameSocketContext';
import { GameWatch } from '../../../../../api/GameWatch';
import { UserGameInfo } from '../../ready-game-page/ReadyGamePage';
import Checkbox from './Checkbox';
import PingPongIcon from '../../../../../assets/icon/pingpong.svg';
import { getImageUrl } from '../../../../../api/ProfileImge';

const clickAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`;

interface ReadyGameProps {
  onClick: () => void;
  gameWatch: GameWatch | undefined;
}

interface Enemy {
  userId: string;
  userGameId: string;
  image: string;
}

export default function ReadyGame({ onClick, gameWatch }: ReadyGameProps) {
  const navigate = useNavigate();
  const socketRef = useSocket();

  const userInfo = useRecoilValue(userState);
  const [userGameInfo, setUserGameInfo] = useState<UserGameInfo | null>(null);
  const [enemyInfo, setEnemyInfo] = useState<Enemy | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<string>('3');

  useEffect(() => {
    socketRef?.once('startReadyGame', async (info: UserGameInfo) => {
      setUserGameInfo(info);
      const imageUrl = await getImageUrl(info.enemyUserId, userInfo.token);
      setEnemyInfo({
        userId: info.enemyUserId,
        userGameId: info.enemyUserGameId,
        image: imageUrl,
      });
    });

    socketRef?.once('speedUpdate', (speed: string) => {
      setSelectedSpeed(speed);
    });

    socketRef?.once('gameStart', () => {
      navigate(`/game/${gameWatch?.gameWatchId}/play`);
    });

    socketRef?.once('gameStartError', () => {
      navigate(`/profile/my`);
    });

    return () => {
      socketRef?.off('startReadyGame');
      socketRef?.off('speedUpdate');
      socketRef?.off('gameStart');
      socketRef?.off('gameStartError');
    };
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (userGameInfo?.role !== 'host') {
      return;
    }
    const { value } = event.target;
    if (selectedSpeed === value) {
      return;
    }
    setSelectedSpeed(value);
    socketRef?.emit('speedUpdate', {
      guestUserGameId: gameWatch?.userGameId2,
      speed: value,
    });
  };

  const gameStart = () => {
    if (userGameInfo?.role === 'host') {
      socketRef?.emit('gameStart', {
        guestUserGameId: gameWatch?.userGameId2,
        speed: +selectedSpeed,
      });
    }
  };

  return (
    <Div>
      {enemyInfo && (
        <ModalWrapper>
          <CloseButton
            type="button"
            onClick={() => {
              socketRef?.emit('cancelReadyGame', {
                gameWatch,
                enemyUserGameId: userGameInfo?.enemyUserGameId,
              });
            }}
          >
            &times;
          </CloseButton>
          <GameReady>GAME READY</GameReady>
          <GameInfo>
            <GameIcon>
              <img src={PingPongIcon} alt="게임 이미지" />
            </GameIcon>
            <GameName>
              <p>핑퐁핑퐁</p>
            </GameName>
          </GameInfo>
          <GamePlayers>
            <Player1>
              <img src={userInfo.imageUrl} alt="방장 이미지" />
            </Player1>
            <Vs>VS</Vs>
            <Player2>
              <img src={enemyInfo?.image} alt="게스트 이미지" />
            </Player2>
          </GamePlayers>
          <GameMaps>
            <SignPost>SELECT</SignPost>
            {/* <GameMapFlow><MapList /></GameMapFlow> */}
            <GameMapFlow>
              <p>속도를 선택하세요:</p>
              <CheckBoxWrap>
                <Checkbox
                  id="speed-1"
                  label="1"
                  checked={selectedSpeed === '1'}
                  onChange={handleCheckboxChange}
                  value="1"
                />
                <Checkbox
                  id="speed-3"
                  label="3"
                  checked={selectedSpeed === '3'}
                  onChange={handleCheckboxChange}
                  value="3"
                />
                <Checkbox
                  id="speed-5"
                  label="5"
                  checked={selectedSpeed === '5'}
                  onChange={handleCheckboxChange}
                  value="5"
                />
              </CheckBoxWrap>
            </GameMapFlow>
          </GameMaps>
          <GameStart>
            <StartButton onClick={gameStart}>START</StartButton>
          </GameStart>
        </ModalWrapper>
      )}
    </Div>
  );
}

const Div = styled.div`
  width: 100%;
  height: 100%;
`;

const ModalWrapper = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 100%;
  background-color: #e1e3ee;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const GameReady = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10%;
  font-size: 5rem;
  font-weight: 900;
  margin-top: 5rem;
  margin-bottom: 1.5rem;
  color: #3f4d97;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 3rem;
  font-weight: 900;
  background: none;
  color: grey;
  border: none;
  cursor: pointer;
`;

const GameInfo = styled.div`
  width: 90%;
  height: 20%;
  background-color: #313c7a;
  border-radius: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GameIcon = styled.div`
  /* width: 30%; */
  /* height: 80%; */
  width: 12rem;
  height: 12rem;
  background-color: #313c7a;
  margin-top: 1rem;
  margin-left: 2rem;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GameName = styled.div`
  width: 50%;
  height: 80%;
  margin-top: 1rem;
  margin-right: 2rem;

  > p {
    color: white;
    font-size: 40px;
    font-weight: bold;
  }
`;

const GamePlayers = styled.div`
  width: 100%;
  height: 20%;
  background-color: #e1e3ee;
  display: flex;
  align-items: space-between;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const Player1 = styled.div`
  width: 40%;
  height: 80%;
  background-color: #e1e3ee;
  margin-top: 1rem;
  border-radius: 50%;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Player2 = styled.div`
  width: 40%;
  height: 80%;
  background-color: #e1e3ee;
  margin-top: 1rem;
  border-radius: 50%;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Vs = styled.div`
  width: 20%;
  height: 80%;
  background-color: #e1e3ee;
  margin-top: 1rem;
  color: red;
  -webkit-text-stroke-width: 0.2rem;
  -webkit-text-stroke-color: black;
  font-size: 4rem;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GameMaps = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
`;

const SignPost = styled.div`
  width: 45%;
  height: 25%;
  margin-left: 2rem;
  background-color: #6d77af;
  color: white;
  font-size: 4rem;
  font-weight: 900;
  padding-top: 1rem;
  border-radius: 2rem 2rem 0 0;
  z-index: 10;
  position: relative;
  top: 0.25px;
`;

const GameMapFlow = styled.div`
  width: 100%;
  height: 75%;
  background-color: #6d77af;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > p {
    font-size: 20px;
    display: inline-block;
  }
`;

const CheckBoxWrap = styled.div`
  display: flex;
  gap: 25px;
  margin-bottom: 20px;
`;

const GameStart = styled.div`
  width: 100%;
  height: 20%;
  background-color: #e1e3ee;
`;

const StartButton = styled.button`
  width: 70%;
  height: 70%;
  background-color: red;
  margin-top: 2rem;
  border-radius: 4rem;
  border-color: white;
  border-width: 1rem;
  color: white;
  font-size: 5rem;
  font-weight: 900;
  &:active {
    animation: ${clickAnimation} 0.2s;
  }
`;
