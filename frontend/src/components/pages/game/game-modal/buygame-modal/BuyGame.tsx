import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import { NoXPopup } from '../../../../commons/modals/popup-modal/Popup';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import { useBuyGameMutation } from '../../../../../api/BuyGame';
import ErrorPopupNav from '../../../../commons/error/ErrorPopupNav';

interface Props {
  isOpenBuyGameModal: boolean;
  handleClickModal: () => void;
  gameId: string;
}

interface ButtonProps {
  yes: boolean;
}

export default function BuyGame({
  isOpenBuyGameModal,
  handleClickModal,
  gameId,
}: Props) {
  // 유저  정보
  const userInfo = useRecoilValue(userState);
  // 에러
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleHideErrorModal = () => {
    setIsErrorGet(false);
  };

  // react-query 게임 구매
  const { mutate: buyGame } = useBuyGameMutation(userInfo.token);

  const handleBuyGame = () => {
    try {
      buyGame({ gameId, token: userInfo.token });
      handleClickModal();
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
      {isOpenBuyGameModal && (
        <NoXPopup onClose={handleClickModal}>
          <MainText>정말로 구매하시겠습니까</MainText>
          <ButtonsWrap>
            <BuyButton yes onClick={() => handleBuyGame()}>
              네
            </BuyButton>
            <BuyButton yes={false} onClick={() => handleClickModal()}>
              아니오
            </BuyButton>
          </ButtonsWrap>
        </NoXPopup>
      )}
    </div>
  );
}

const MainText = styled.p`
  margin: 30px 0px;
  color: black;
  font-size: 1.8rem;
  font-weight: bolder;
  width: 20rem;
`;

export const ButtonsWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 18rem;
  align-items: center;
  justify-content: space-between;
`;

export const BuyButton = styled.button<ButtonProps>`
  font-family: 'NanumGothic';
  font-size: 1.4rem;
  font-weight: bold;
  align-self: center;
  width: 7rem;
  color: white;
  background-color: ${({ yes }) => (yes ? '#da0d00' : '#313c7a')};
  border-radius: 20px;
  border: none;
  margin-bottom: 20px;
  padding: 7px;
  cursor: pointer;
`;
