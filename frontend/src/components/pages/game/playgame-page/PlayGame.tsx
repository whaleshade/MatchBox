import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../commons/layout/Layout';
import PingPong from './games/PingPong';
import { useSocket } from './game-socket/GameSocketContext';
import Popup from '../../../commons/modals/popup-modal/Popup';

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

export default function PlayGame() {
  const socket = useSocket();
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [winner, setWinner] = useState<string>('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [nickname1, setNickname1] = useState<string>('');
  const [nickname2, setNickname2] = useState<string>('');

  const isHost = useRef<boolean>(false);
  const isWatcher = useRef<boolean>(false);

  const { pathname } = window.location;
  const gameWatchId = pathname.split('/')[2];

  useEffect(() => {
    if (socket) {
      socket.emit('checkGameWatchId', { gameWatchId });

      socket.once('checkGameWatchId', ({ result }: { result: boolean }) => {
        if (!result && !showModal) {
          navigate('/profile/my', { replace: true });
        } else {
          setShowGame(true);
        }
      });

      socket.once(
        'nickname',
        (userNicknames: { nickname1: string; nickname2: string }) => {
          setNickname1(userNicknames.nickname1);
          setNickname2(userNicknames.nickname2);
        },
      );

      socket.once('ishost', (role: { isHost: boolean; isWatcher: boolean }) => {
        isHost.current = role.isHost;
        isWatcher.current = role.isWatcher;
      });
    }

    socket?.on('scores', (scores: { scoreA: number; scoreB: number }) => {
      if (
        scores === undefined ||
        scores.scoreA === undefined ||
        scores.scoreB === undefined
      ) {
        return;
      }
      setScoreA(scores.scoreA);
      setScoreB(scores.scoreB);
    });

    socket?.on('gameover', (gameWinner: { winner: string }) => {
      if (gameWinner === undefined || gameWinner.winner === undefined) {
        return;
      }
      setWinner(gameWinner.winner);
      setShowModal(true);
    });

    return () => {
      socket?.off('checkGameWatchId');
      socket?.off('nickname');
      socket?.off('ishost');
      socket?.off('scores');
      socket?.off('gameover');
    };
  });

  const handleClose = () => {
    if (isWatcher.current === true) {
      navigate('/game/shop');
    } else {
      setShowModal(false);
      navigate('/profile/my', { replace: true });
    }
  };

  const giveUp = () => {
    if (!isWatcher.current) {
      socket?.emit('giveUp');
    } else {
      navigate('/game/shop', { replace: true });
    }
  };

  return (
    <Layout>
      {showModal && (
        <Popup onClose={handleClose}>
          <WinnerMsg>위너는 {winner}!!</WinnerMsg>
        </Popup>
      )}
      {showGame && (
        <GameFrame>
          <GameHeader>
            <Player1>{nickname1}</Player1>
            <GameInfo />
            <Player2>{nickname2}</Player2>
          </GameHeader>
          <Score>
            <Player2Score>{scoreB}</Player2Score>
            <h1>SCORE</h1>
            <Player1Score>{scoreA}</Player1Score>
          </Score>
          <GameBoard>
            <PingPong />
          </GameBoard>
          <GameFooter>
            <GGButton onClick={giveUp}>GG</GGButton>
          </GameFooter>
        </GameFrame>
      )}
    </Layout>
  );
}

const GameFrame = styled.div`
  width: 100%;
  height: 100%;
  background-color: #e1e3ee;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
`;

const GameHeader = styled.div`
  width: 90%;
  height: 10%;
  background-color: #313c7a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  border-radius: 1.5rem;
`;

const Player1 = styled.div`
  width: 20%;
  height: 80%;
  background-color: #e1e3ee;
  color: black;
`;

const Player2 = styled.div`
  width: 20%;
  height: 80%;
  background-color: #e1e3ee;
  color: black;
`;

const GameInfo = styled.div`
  width: 50%;
  height: 80%;
  background-color: #313c7a;
`;

const Score = styled.div`
  width: 90%;
  height: 5%;
  background-color: #e1e3ee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: 900;
  border-radius: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const Player1Score = styled.div`
  width: 20%;
  height: 80%;
  background-color: #e1e3ee;
  border: black solid 0.4rem;
  color: blue;
`;

const Player2Score = styled.div`
  width: 20%;
  height: 80%;
  background-color: #e1e3ee;
  border: black solid 0.4rem;
  color: red;
`;

const GameBoard = styled.div`
  width: 90%;
  height: 80vh;
  background-color: white;
  border: black solid 0.4rem;
  padding: 1rem;
`;

const GameFooter = styled.div`
  width: 90%;
  height: 10%;
  background-color: #313c7a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 900;
  border-radius: 1.5rem;
`;

const GGButton = styled.button`
  width: 70%;
  height: 80%;
  background-color: red;
  border-radius: 4rem;
  border-color: white;
  border-width: 1rem;
  color: white;
  font-size: 3rem;
  font-weight: 900;
  &:active {
    animation: ${clickAnimation} 0.2s;
  }
`;

const WinnerMsg = styled.div`
  width: 35rem;
  height: 35rem;
  background-color: #e1e3ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  border-radius: 1.5rem;
  color: black;
`;
