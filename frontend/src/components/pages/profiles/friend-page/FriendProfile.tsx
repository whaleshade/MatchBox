import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import Layout from '../../../commons/layout/Layout';
import { userState } from '../../../../recoil/locals/login/atoms/atom';
import Header from '../../../commons/header/Header';
import Footer from '../../../commons/footer/Footer';
import PingPongIcon from '../../../../assets/icon/pingpong.svg';
import SelectArrow from '../../../../assets/icon/SelectArrow.svg';
import { getImageUrl } from '../../../../api/ProfileImge';
import { useSocket } from '../../login/login-page/LoginSocketContext';
import AcceptWaiting from '../../game/game-modal/accept-waiting-modal/AcceptWaiting';
import ErrorPopupNav from '../../../commons/error/ErrorPopupNav';

interface User {
  image: string;
  nickname: string;
  intraId: string;
}

interface UserGame {
  game: {
    gameId: string;
    name: string;
  };
  gameHistory: {
    winCounts: number;
    loseCounts: number;
  };
}

const initailUserValues = {
  userId: '',
  image: '',
  nickname: '',
  intraId: '',
};

export default function FriendProfile() {
  // 페이지 이동
  const navigate = useNavigate();

  // 유저  정보
  const userInfo = useRecoilValue(userState);

  // 유저 게임 정보들
  const [userGames, setUserGames] = useState<UserGame[] | null>(null);

  // 게임 선택 박스 상태
  const [selectedOpen, setSelectedOpen] = useState<boolean>(false);

  // 선택된 게임 -> 초기 게임 핑퐁핑퐁(0)
  const [selectedGame, setSelectedGame] = useState<string>('핑퐁핑퐁');
  const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGame(event.target.value);
  };

  const selectRef = useRef<HTMLSelectElement>(null);
  const socketRef = useSocket();

  // 에러
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleHideErrorModal = () => {
    setIsErrorGet(false);
  };

  const getUserGameHistoryText = (gameName: string) => {
    const selectedUserGame = userGames?.filter(
      userGame => userGame.game.name === gameName,
    );
    const history = selectedUserGame && selectedUserGame[0]?.gameHistory;
    if (!history) {
      return '0승 0패';
    }
    return `${history.winCounts}승 ${history.loseCounts}패`;
  };

  // 유저 정보
  const [user, setUser] = useState<User>(initailUserValues);

  // path의 buddyId 가져오기
  const path = useLocation().pathname;
  const buddyId = path.split('/')[3];

  // 친구 추가 버튼 클릭 여부
  const [isFriend, setIsFriend] = useState<boolean>(false);

  const handleClickModal = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/friends`,
        {
          userId: buddyId,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      setIsFriend(true);
    } catch (error) {
      setIsErrorGet(true);
      setErrorMessage('요청을 처리할 수 없습니다.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // 친구 상세 프로필 조회
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/friends/${buddyId}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      );
      // 친구 이미지 조회
      const url = await getImageUrl(buddyId, userInfo.token);
      response.data.user.image = url;
      setUser(response.data.user);
      setUserGames(response.data.userGame);
      if (response.data.isFriend === true) {
        setIsFriend(true);
      }
    };
    fetchData();
  }, []);

  // 초대 수락 대기 모달
  const [isOpenAcceptWaitingModal, setIsOpenAcceptWaitingModal] =
    useState<boolean>(false);
  const onCloseWaitingModal = () => {
    setIsOpenAcceptWaitingModal(false);
  };

  useEffect(() => {
    // 초대 보낸 유저 or 받은 유저가 게임을 구매하지 않은 경우
    socketRef?.on('inviteFail', (message: string) => {
      setIsErrorGet(true);
      setErrorMessage(message);
      setIsOpenAcceptWaitingModal(false);
    });

    // 초대 보내기 성공
    socketRef?.once('inviteSuccess', () => {
      setIsOpenAcceptWaitingModal(true);
    });

    // 초대 거부됨
    socketRef?.once('inviteReject', () => {
      setIsErrorGet(true);
      setErrorMessage('상대방이 초대 거부함');
      setIsOpenAcceptWaitingModal(false);
    });

    // 초대 받은 사람이 오프라인 상태
    socketRef?.once('inviteCancelFail', message => {
      setIsErrorGet(true);
      setErrorMessage(message);
      setIsOpenAcceptWaitingModal(false);
    });

    return () => {
      socketRef?.off('inviteFail');
      socketRef?.off('inviteSuccess');
      socketRef?.off('inviteReject');
      socketRef?.off('inviteCancelFail');
    };
  });

  return (
    <Layout
      Header={<Header title="Friend's Game" />}
      Footer={<Footer tab="" />}
    >
      <ErrorPopupNav
        isErrorGet={isErrorGet}
        message={errorMessage}
        handleErrorClose={handleHideErrorModal}
      />
      {isOpenAcceptWaitingModal && (
        <AcceptWaiting
          handleClickModal={onCloseWaitingModal}
          buddyId={buddyId}
        />
      )}
      <MyPageDiv>
        {/* 유저 프로필 */}
        <UserProfileContainer>
          <UserImageWrap>
            <img src={user.image} alt="유저 이미지" />
          </UserImageWrap>
          <UserCardWrap>
            <UserNameText>{user.nickname}</UserNameText>
            <UserNinknameText>{user.intraId}</UserNinknameText>
          </UserCardWrap>
          <AddFriendButton isFriend={isFriend} onClick={handleClickModal}>
            친구추가 +
          </AddFriendButton>
        </UserProfileContainer>
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
                  <option value="핑퐁핑퐁">핑퐁핑퐁</option>
                  <option value="테트리스">테트리스</option>
                  <option value="퍼즐팡팡">퍼즐팡팡</option>
                  <option value="좀비좀비">좀비좀비</option>
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
          <HistoryText>{getUserGameHistoryText(selectedGame)}</HistoryText>
          <GameButton
            onClick={() =>
              navigate(`/game/record/${buddyId}/history?game=${selectedGame}`)
            }
          >
            전적 보기
          </GameButton>
          <GameButton
            onClick={() => {
              socketRef?.emit('inviteGame', { userId: buddyId });
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
  grid-template-rows: 18fr 18fr 44fr;
  place-items: center;
  grid-template-areas:
    'profile'
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

const AddFriendButton = styled.button<{ isFriend: boolean }>`
  font-family: 'NanumGothic';
  font-size: 1.8rem;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 1rem;
  width: 13rem;
  color: white;
  background: ${({ isFriend }) => (isFriend === true ? '#737373' : '#6d77af')};
  border-radius: 10px;
  border: 1px solid black;
  cursor: ${({ isFriend }) => (isFriend === true ? 'default' : 'pointer')};
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
  height: 90%;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
