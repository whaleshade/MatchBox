import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Layout from '../../../commons/layout/Layout';
import Footer from '../../../commons/footer/Footer';
import Header from '../../../commons/header/Header';
import PingPongIcon from '../../../../assets/icon/pingpong.svg';
import TestrisIcon from '../../../../assets/icon/testris.svg';
import PuzzleIcon from '../../../../assets/icon/puzzle.svg';
import ZombieIcon from '../../../../assets/icon/zombie.svg';
import { userState } from '../../../../recoil/locals/login/atoms/atom';
import BuyGame from '../game-modal/buygame-modal/BuyGame';
import { useGames } from '../../../../api/GetGames';

interface BuyButtonProps {
  isBuy: boolean;
}

interface SelectGameContainerProps {
  isSelected: boolean;
}

const gameIcons = [PingPongIcon, TestrisIcon, PuzzleIcon, ZombieIcon];

export default function GameShop() {
  // 페이지 이동
  const navigate = useNavigate();

  // 유저 정보
  const userInfo = useRecoilValue(userState);

  // 모달 관리
  const [isOpenBuyGameModal, setIsOpenBuyGameModal] = useState<boolean>(false);
  const handleClickModal = () => {
    if (selectedGameId === '') {
      return;
    }
    setIsOpenBuyGameModal(!isOpenBuyGameModal);
  };

  // react-query 게임 정보
  const { data: games } = useGames(userInfo.token);

  // 선택된 게임 Id
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId);
  };

  // 관전하러 가기
  const handleGameWatchClicked = () => {
    if (selectedGameId !== '') {
      navigate(`/game/watch/${selectedGameId}`);
    }
  };

  return (
    <Layout
      Header={<Header title="Game Shop" />}
      Footer={<Footer tab="game" />}
    >
      <BuyGame
        isOpenBuyGameModal={isOpenBuyGameModal}
        handleClickModal={handleClickModal}
        gameId={selectedGameId}
      />
      <GameShopDiv>
        <ManualTextWrap>
          <p>게임을 관전하려면 아이콘을 클릭하세요!</p>
        </ManualTextWrap>
        <SelectGameDiv>
          <SelectGameGridDiv>
            {games?.map((game, index) => {
              return (
                <SelectGameContainer
                  key={game.gameId}
                  isSelected={selectedGameId === game.gameId}
                  onClickCapture={() => handleGameSelect(game.gameId)}
                >
                  <GameImageWrap>
                    <img src={gameIcons[index]} alt={gameIcons[index]} />
                    <strong>{game.name}</strong>
                    <p>{`${game.price.toLocaleString('en-US')}₩`}</p>
                    <BuyButton
                      isBuy={game.isBuy}
                      onClick={() => {
                        if (game.isPlayable && !game.isBuy) {
                          handleClickModal();
                        }
                      }}
                    >
                      BUY
                    </BuyButton>
                  </GameImageWrap>
                </SelectGameContainer>
              );
            })}
          </SelectGameGridDiv>
          <GameWatchingButton onClick={handleGameWatchClicked}>
            관전하기
          </GameWatchingButton>
        </SelectGameDiv>
      </GameShopDiv>
    </Layout>
  );
}

const GameShopDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ManualTextWrap = styled.div`
  margin: 20px 0;
  > p {
    color: #ad46c7;
    text-align: center;
    font-size: 1.4rem;
  }
`;

const SelectGameDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  background-color: #e1e3ee;
  border-radius: 15px;
`;

const SelectGameGridDiv = styled.div`
  padding: 20px 0;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
`;

const SelectGameContainer = styled.div<SelectGameContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 12px 18px;
  border: 5px solid transparent;
  border: ${({ isSelected }) =>
    isSelected ? '5px solid #31D37C;' : '5px solid transparent;'};
  cursor: pointer;
`;

const GameImageWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > img {
    width: 11rem;
    height: 11rem;
  }
  > strong {
    margin: 10px 0px;
    font-size: 1.8rem;
  }
  > p {
    margin: 0px;
    font-size: 1.8rem;
    color: #14ae5c;
    font-weight: bold;
  }
`;

const BuyButton = styled.button<BuyButtonProps>`
  margin-top: 10px;
  font-family: 'NanumGothic';
  background-color: ${({ isBuy }) => (isBuy ? '#B3B3B3' : '#D84A4A')};
  color: white;
  font-weight: bold;
  font-size: 1.8rem;
  border-radius: 7.5px;
  border: none;
  width: 6rem;
  cursor: pointer;
`;

const GameWatchingButton = styled.button`
  margin-bottom: 20px;
  background-color: #6d77af;
  color: white;
  border: 1px solid black;
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
`;
