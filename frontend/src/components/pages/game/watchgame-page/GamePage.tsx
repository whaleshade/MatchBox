import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AxiosError } from 'axios';
import GameSelect from './component/GameSelect';
import Layout from '../../../commons/layout/Layout';
import Header from '../../../commons/header/Header';
import Footer from '../../../commons/footer/Footer';
import GameHistory from './component/GameHistory';
import { useGetGameList, useGetGameWatchList } from '../../../../api/Game';
import {
  ICurrentGameHistory,
  IGameHistroy,
  IGameInfo,
  IMatch,
  IOldGameHistory,
} from '.';
import { getImageUrl } from '../../../../api/ProfileImge';
import { userState } from '../../../../recoil/locals/login/atoms/atom';
import { useGetGameHistory } from '../../../../api/Friends';
import { isErrorOnGet } from '../../../../recoil/globals/atoms/atom';
import { useSocket } from '../playgame-page/game-socket/GameSocketContext';
import ErrorGame from './component/ErrorGame';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.8rem;
  align-items: center;
  padding: 0 2.4rem;
`;

const GameSelectWrapper = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const GameHistorytWrapper = styled.ul`
  list-style: none;
  margin-top: 2.5rem;
  padding: 0 0 0 0;
  > li + li {
    margin-top: 1.3rem;
  }
`;

interface Prop {
  title: string;
}

export default function GamePage({ title }: Prop) {
  const socketRef = useSocket();
  /* 공용 상태 */
  // 게임 와치 페이지와 게임 전적 페이지 구별하는 용도
  const isGameWatchPage = title === 'Game Watch';
  const { id } = useParams<string>();
  const gameId = id;
  const userId = id;
  const userInfo = useRecoilValue(userState);
  const navigate = useNavigate();
  const [gameName, setGameName] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<string>(gameName);
  const handleError = (error: AxiosError) => {
    if (error.response?.status === 409) {
      // NotFound 에러에 대한 처리 (모달 띄우기)
      setIsErrorGet(true);
      setErrorMsg(
        '[게임 조회 실패] 해당하는 게임을 구매하지 않거나 조회에 실패했습니다',
      );
    } else {
      navigate('/404');
    }
  };
  const [gameIdMapping, setGameIdMapping] = useState<Map<string, string>>(
    new Map(),
  );
  const [isErrorGet, setIsErrorGet] = useRecoilState(isErrorOnGet);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const { data: gameInfos } = useGetGameList();
  const getBackPath = () => {
    if (isGameWatchPage) {
      return '/game/shop';
    }
    if (userInfo.userId === userId) {
      return '/profile/my';
    }
    return `/profile/friend/${userId}`;
  };
  const backPath = getBackPath();
  const errorHandler = () => {
    navigate(backPath);
  };

  /* 게임 와치 페이지 상태 */
  const [gameCurrentHistoryData, setGameCurrentHistoryData] =
    useState<ICurrentGameHistory[]>();
  const {
    data: gameWatchData,
    isLoading,
    isError,
  } = useGetGameWatchList(gameId, handleError, isGameWatchPage);

  // 다른 게임 페이지 상태로 변경: Select 박스에 전달하여 다른 value 선택 시
  const handleGameWatchChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedGame(event.target.value);
    const newGameId = gameIdMapping.get(event.target.value);
    if (newGameId) {
      // gameId가 변경되면 해당 gameId로 페이지를 이동합니다.
      navigate(`/game/watch/${newGameId}`);
    }
  };

  const handleGameWatchClick = async (clickedGameWatchId: string) => {
    socketRef
      ?.emit('gameWatch', {
        gameWatchId: clickedGameWatchId,
      })
      .on('gameWatchSuccess', data => {
        navigate(`/game/${clickedGameWatchId}/play`);
      })
      .on('gameWatchFull', data => {
        setIsErrorGet(true);
        setErrorMsg('[게임 입장 실패] 인원이 다 찼습니다.');
      })
      .on('gameWatchFail', data => {
        setIsErrorGet(true);
        setErrorMsg('[게임 입장 실패] 진행 중이지 않은 게임입니다.');
      });
  };

  // useEffect(() => {
  //   socketRef?.once('gameWatchSuccess', data => {
  //     console.log('gameWatchSuccess: ', data);
  //     navigate(`/game/${data?.gameWatchId}/play`);
  //   });
  //   socketRef?.once('gameWatchFull', data => {
  //     console.log('gameWatchFull: ', data);
  //   });
  //   socketRef?.once('gameWatchFail', data => {
  //     console.log('gameWatchFail: ', data);
  //   });
  //   return () => {
  //     socketRef?.off('gameWatchSuccess');
  //     socketRef?.off('gameWatchFull');
  //     socketRef?.off('gameWatchFail');
  //   };
  // }, [socketRef]);

  // <Link to={`/game/watch/${data.matchId}`}>

  /* 게임 전적 페이지 상태 */
  const [gameOldHistoryData, setGameOldHistoryData] =
    useState<IOldGameHistory[]>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameNameByQurey = queryParams.get('game');
  const { data: gameHistory } = useGetGameHistory(
    userId,
    gameNameByQurey,
    handleError,
    !isGameWatchPage,
  );

  // 다른 게임 페이지 상태로 변경: Select 박스에 전달하여 다른 value 선택 시
  const handleGameHistoryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedGame(event.target.value);
    const newGameId = gameIdMapping.get(event.target.value);

    if (newGameId) {
      // gameId가 변경되면 해당 gameId로 페이지를 이동합니다.
      navigate(`/game/record/${userId}/history?game=${event.target.value}`);
    }
  };

  /* UseEffect */
  // 에러모달 설정과 새로고침 시 URL의 선택한 Select Game 유지
  useEffect(() => {
    setIsErrorGet(false);

    if (title === 'Game Watch' && gameId) {
      const getKeyByValue = (map: Map<string, string>, value: string) => {
        const entryFound = Array.from(map.entries()).find(
          ([key, val]) => val === value,
        );
        return entryFound ? entryFound[0] : null;
      };
      const keyFound = getKeyByValue(gameIdMapping, gameId);

      if (keyFound) {
        setSelectedGame(keyFound);
      }
    } else if (gameNameByQurey) {
      setSelectedGame(gameNameByQurey);
    }
  }, [selectedGame]);

  // 리액트 쿼리에서 가져온 데이터들을 상태로 업데이트
  useEffect(() => {
    if (gameId && gameWatchData) {
      setGameName(gameWatchData.name);
      const updateGameHistoryData = async () => {
        const newGameHistory: ICurrentGameHistory[] = await Promise.all(
          gameWatchData.matches.map(async (data: IMatch) => {
            const imageUrlOfUser1 = await getImageUrl(
              data.user1.userId,
              userInfo.token,
            );
            const imageUrlOfUser2 = await getImageUrl(
              data.user2.userId,
              userInfo.token,
            );
            return {
              user1: data.user1.nickname,
              user1Image: imageUrlOfUser1,
              user2: data.user2.nickname,
              user2Image: imageUrlOfUser2,
              currentViewer: data.currentViewer,
              matchId: data.gameWatchId,
            };
          }),
        );
        setGameCurrentHistoryData(newGameHistory);
      };
      updateGameHistoryData();
    } else if (gameHistory) {
      setGameName(gameHistory.gameName);
      const updateGameHistoryData = async () => {
        const newGameHistory: IOldGameHistory[] = await Promise.all(
          gameHistory.gameHistory.map(async (data: IGameHistroy) => {
            const imageUrlOfWinner = await getImageUrl(
              data.winner.userId,
              userInfo.token,
            );
            const imageUrlOfLoser = await getImageUrl(
              data.loser.userId,
              userInfo.token,
            );
            return {
              winner: data.winner.nickname,
              winnerImage: imageUrlOfWinner,
              winnerScore: data.winner.score,
              loser: data.loser.nickname,
              loserImage: imageUrlOfLoser,
              loserScore: data.loser.score,
              gameHistoyId: data.id,
            };
          }),
        );
        setGameOldHistoryData(newGameHistory);
      };
      updateGameHistoryData();
    }
  }, [gameWatchData, gameHistory]);

  // 게임이름과 게임ID를 맵핑하기 위해서 리액트 쿼리로 상태 업데이트하는 로직
  useEffect(() => {
    if (gameInfos) {
      const createGameIdMapping = async () => {
        const newGameIdMapping = new Map();

        gameInfos.forEach((game: IGameInfo) => {
          newGameIdMapping.set(game.name, game.gameId);
        });

        setGameIdMapping(newGameIdMapping);
      };

      createGameIdMapping();
    }
  }, [gameInfos]);

  return (
    <Layout
      Header={<Header title={title} backPath={backPath} />}
      Footer={<Footer tab="Game" />}
    >
      <Container>
        <GameSelectWrapper>
          <GameSelect
            gameName={gameName}
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
            handleGameChange={
              isGameWatchPage ? handleGameWatchChange : handleGameHistoryChange
            }
          />
        </GameSelectWrapper>

        {isErrorGet ? (
          <ErrorGame message={errorMsg} handleClick={errorHandler} />
        ) : (
          <GameHistorytWrapper>
            {isGameWatchPage
              ? gameCurrentHistoryData?.map((data: ICurrentGameHistory) => {
                  return (
                    <GameWatch
                      key={data.matchId}
                      onClick={() => handleGameWatchClick(data.matchId)}
                    >
                      <GameHistory
                        key={data.matchId}
                        matchId={data.matchId}
                        user1={data.user1}
                        user2={data.user2}
                        user1Image={data.user1Image}
                        user2Image={data.user2Image}
                        currentViewer={data.currentViewer}
                        selectedGame={selectedGame}
                      />
                    </GameWatch>
                  );
                })
              : gameOldHistoryData?.map((data: IOldGameHistory) => {
                  return (
                    <GameHistory
                      key={data.gameHistoyId}
                      user1={data.winner}
                      user2={data.loser}
                      user1Image={data.winnerImage}
                      user2Image={data.loserImage}
                      winnerScore={data.winnerScore}
                      loserScore={data.loserScore}
                    />
                  );
                })}
          </GameHistorytWrapper>
        )}
      </Container>
    </Layout>
  );
}

const GameWatch = styled.div`
  cursor: pointer;
`;
