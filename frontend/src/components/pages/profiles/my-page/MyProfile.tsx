import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Layout from '../../../commons/layout/Layout';
import Footer from '../../../commons/footer/Footer';
import Header from '../../../commons/header/Header';
import EditMy from '../profile-modal/editmy-modal/EditMy';
import PingPongIcon from '../../../../assets/icon/pingpong.svg';
import SelectArrow from '../../../../assets/icon/SelectArrow.svg';
import { userState } from '../../../../recoil/locals/login/atoms/atom';
import Matching from '../../game/game-modal/matching-modal/Matching';
import { useSocket } from '../../game/playgame-page/game-socket/GameSocketContext';
import ErrorPopup from '../../../commons/error/ErrorPopup';
import { isErrorOnGet } from '../../../../recoil/globals/atoms/atom';
import ErrorPopupNav from '../../../commons/error/ErrorPopupNav';

interface User {
  userId: string;
  image: string;
  nickname: string;
  intraId: string;
  email: string;
  phoneNumber: string;
}

interface UserGame {
  game: {
    gameId: string;
    name: string;
  };
  gameHistory: {
    winCount: number;
    loseCount: number;
  };
}

const initailUserValues = {
  userId: '',
  image: '',
  nickname: '',
  intraId: '',
  email: '',
  phoneNumber: '',
};

export default function MyProfile() {
  // 페이지 이동
  const navigate = useNavigate();

  // 유저  정보
  const userInfo = useRecoilValue(userState);

  // 에러
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleHideErrorModal = () => {
    setIsErrorGet(false);
  };

  // 모달 관리
  const [isOpenEditProfileModal, setIsOpenEditProfileModal] =
    useState<boolean>(false);
  const handleClickModal = () => {
    setIsOpenEditProfileModal(!isOpenEditProfileModal);
  };

  // 검색된 유저 이미지
  const [userImgaeUrl, setUserImageUrl] = useState<string>('');

  // 유저 정보
  const [user, setUser] = useState<User>(initailUserValues);

  // 유저 게임 정보들
  const [userGames, setUserGames] = useState<UserGame[] | null>(null);

  // 게임 선택 박스 상태
  const [selectedOpen, setSelectedOpen] = useState<boolean>(false);

  // 선택된 게임 -> 초기 게임 핑퐁핑퐁(0)
  const [selectedGameId, setSelectedGameId] = useState<string>('');

  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGameId(event.target.value);
  };

  // 게임 ID로 게임 이름을 가져오는 맵
  const [gameIdMapping, setGameIdMapping] = useState<Map<string, string>>(
    new Map(),
  );

  const selectRef = useRef<HTMLSelectElement>(null);
  const socketRef = useSocket();

  const getUserGameHistoryText = (gameId: string) => {
    const selectedUserGameId = userGames?.filter(
      userGame => userGame.game.gameId === gameId,
    );
    const history = selectedUserGameId && selectedUserGameId[0]?.gameHistory;
    if (!history) {
      return '0승 0패';
    }
    return `${history.winCount}승 ${history.loseCount}패`;
  };

  const [showRandomMatchModal, setShowRandomMatchModal] = useState(false);
  const handleClickRandomMatchModal = () => {
    setShowRandomMatchModal(!showRandomMatchModal);
  };

  const getGameNameById = (gameId: string) => {
    const gameName = gameIdMapping.get(gameId);
    return gameName;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/account`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      setSelectedGameId(data.data.userGame[0].game.gameId);
      setUser(data.data.user);
      setUserGames(data.data.userGame);

      const createGameIdMapping = async () => {
        const newGameIdMapping = new Map();
        data.data.userGame.forEach((game: UserGame) => {
          newGameIdMapping.set(game.game.gameId, game.game.name);
        });
        setGameIdMapping(newGameIdMapping);
      };
      createGameIdMapping();
    };
    fetchData();
  }, []);

  useEffect(() => {
    socketRef?.once('randomMatchStart', () => {
      setShowRandomMatchModal(true);
    });

    socketRef?.on('randomMatchError', (message: string) => {
      setIsErrorGet(true);
      setErrorMessage(message);
      setShowRandomMatchModal(false);
    });

    return () => {
      socketRef?.off('randomMatchStart');
      socketRef?.off('randomMatchError');
    };
  });

  return (
    <Layout Header={<Header title="MyPage" />} Footer={<Footer tab="my" />}>
      <ErrorPopupNav
        isErrorGet={isErrorGet}
        message={errorMessage}
        handleErrorClose={handleHideErrorModal}
      />
      {!selectedGameId && <ErrorPopup message={errorMessage} />}
      <EditMy
        isOpenEditProfileModal={isOpenEditProfileModal}
        handleClickModal={handleClickModal}
      />
      {showRandomMatchModal && (
        <Matching handleClickModal={handleClickRandomMatchModal} />
      )}
      <MyPageDiv>
        {/* 유저 프로필 */}
        <UserProfileContainer>
          <UserImageWrap>
            <img src={userInfo.imageUrl} alt="유저 이미지" />
          </UserImageWrap>
          <UserCardWrap>
            <UserNameText>{userInfo.nickname}</UserNameText>
            <UserNinknameText>{user.intraId}</UserNinknameText>
          </UserCardWrap>
          <EditProfileButton onClick={handleClickModal}>
            프로필 수정
          </EditProfileButton>
        </UserProfileContainer>
        {/* 유저 정보 */}
        <UserInfoContainer>
          <UserInfoWrap>
            <UserInfoKey>
              <p>Email</p>
            </UserInfoKey>
            <UserInfoValue>
              <p>{user.email}</p>
            </UserInfoValue>
            <UserInfoKey>
              <p>Github</p>
            </UserInfoKey>
            <UserInfoValue>
              <p>https://github.com/Match-Box-Team</p>
            </UserInfoValue>
          </UserInfoWrap>
        </UserInfoContainer>
        {/* 게임 선택 */}
        <SelectGameContainer>
          <SelectGameWrap>
            <PingPongImageWrap>
              <img src={PingPongIcon} alt={PingPongIcon} />
            </PingPongImageWrap>
            <SelectContainer>
              <SelectWrapper>
                <Select
                  ref={selectRef}
                  name="game"
                  onClick={() => {
                    setSelectedOpen(!selectedOpen);
                  }}
                  onChange={handleGameChange}
                >
                  {userGames?.map(userGame => (
                    <option
                      key={userGame.game.gameId}
                      value={userGame.game.gameId}
                    >
                      {userGame.game.name}
                    </option>
                  ))}
                </Select>
                <ArrowIcon
                  onClick={() => {
                    setSelectedOpen(!selectedOpen);
                    selectRef.current?.click();
                  }}
                  isOpen={selectedOpen}
                >
                  <img src={SelectArrow} alt={SelectArrow} />
                </ArrowIcon>
              </SelectWrapper>
            </SelectContainer>
          </SelectGameWrap>
        </SelectGameContainer>
        <GameContainer>
          <HistoryText>{getUserGameHistoryText(selectedGameId)}</HistoryText>
          <GameButton
            onClick={() => {
              let gameName = getGameNameById(selectedGameId);
              if (!selectedGameId) {
                gameName = '핑퐁핑퐁';
              }
              navigate(
                `/game/record/${userInfo.userId}/history?game=${gameName}`,
              );
            }}
          >
            전적 보기
          </GameButton>
          <GameButton
            onClick={() => {
              if (!selectedGameId) {
                setIsErrorGet(true);
                setErrorMessage('게임을 선택해주세요');
                return;
              }
              socketRef?.emit('randomMatch', { gameId: selectedGameId });
            }}
          >
            게임하기
          </GameButton>
        </GameContainer>
      </MyPageDiv>
    </Layout>
  );
}

// 전체 div
const MyPageDiv = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: 18fr 18fr 20fr 44fr;
  place-items: center;
  grid-template-areas:
    'profile'
    'info'
    'select'
    'game';
`;

/*
 ** 유저 프로필
 */
const UserProfileContainer = styled.div`
  grid-area: profile;
  width: 100%;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d2d2d2;
`;

const UserImageWrap = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserCardWrap = styled.div`
  margin: 0 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const UserNameText = styled.p`
  margin: 10px 0px;
  text-align: start;
  align-self: flex-start;
  font-family: 'NanumGothic';
  font-size: 2rem;
  font-weight: bold;
`;

const UserNinknameText = styled.p`
  margin: 5px 0px;
  text-align: start;
  align-self: flex-start;
  font-family: 'NanumGothic';
  font-size: 2rem;
  color: #2d3648;
`;

const EditProfileButton = styled.button`
  font-family: 'NanumGothic';
  font-size: 1.8rem;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 1rem;
  width: 13rem;
  color: white;
  background: #6d77af;
  border-radius: 10px;
  border: 1px solid black;
  cursor: pointer;
`;

/*
 ** 유저 정보
 */
const UserInfoContainer = styled.div`
  grid-area: info;
  padding: 5px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const UserInfoWrap = styled.div`
  display: grid;
  grid-template-columns: 2fr 6fr;
  grid-template-rows: 1fr 1fr;
`;

const UserInfoKey = styled.div`
  display: flex;
  align-items: center;
  > p {
    margin: 20px 0px;
    font-size: 1.8rem;
    color: #2d3648;
  }
`;

const UserInfoValue = styled.div`
  display: flex;
  align-items: center;
  > p {
    font-size: 1.4rem;
    color: #2d3648;
  }
`;

/*
 ** 게임 선택
 */
const SelectGameContainer = styled.div`
  grid-area: select;
  background-color: #313c7a;
  border-radius: 20px;
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;

const SelectGameWrap = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 2fr;
`;

const PingPongImageWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    width: 9rem;
    height: 9rem;
  }
`;

const SelectContainer = styled.div`
  margin-left: 0.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;

const Select = styled.select`
  width: 100%;
  font-family: 'NanumGothic';
  font-size: 2.4rem;
  font-weight: bold;
  color: #555555;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 14px 0;
  text-align: center;
  cursor: pointer;

  appearance: none;

  &:focus {
    outline: none;
  }

  option {
    width: 100%;
    font-family: 'NanumGothic';
    font-size: 2rem;
    color: #555555;
  }
`;

const ArrowIcon = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0%)
    ${props => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  pointer-events: none;

  > img {
    width: 3.2rem;
    height: 3.2rem;
  }
`;

/*
 ** 게임
 */
const GameContainer = styled.div`
  grid-area: game;
  background-color: #313c7a;
  border-radius: 20px;
  background: #e1e3ee;
  border-radius: 10px;
  width: 85%;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const HistoryText = styled.p`
  margin-top: 20px;
  margin-bottom: 10px;
  font-family: 'SEBANG Gothic';
  font-size: 3.5rem;
`;

const GameButton = styled.button`
  font-family: 'SEBANG Gothic';
  font-size: 3.5rem;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 1rem;
  width: 60%;
  color: white;
  background: #6d77af;
  border-radius: 10px;
  border: 1px solid black;
  cursor: pointer;
`;
