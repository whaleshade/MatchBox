import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { isErrorOnGet } from '../../../recoil/globals/atoms/atom';

const Popup = styled.div`
  position: fixed;
  width: 40vh;
  height: 10vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid #f5c6cb;
  z-index: 10001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 15px;
`;

const ModalOutside = styled.div`
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
  width: 412px;
  max-height: 915px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
`;

interface ErrorPopupProps {
  message: string;
  handleClick?: () => void;
}

function ErrorPopup({ message, handleClick }: ErrorPopupProps) {
  const [isErrorGet, setIsErrorGet] = useRecoilState(isErrorOnGet);
  return (
    <div>
      {isErrorGet && (
        <ModalOutside onClick={() => setIsErrorGet(false)}>
          <Popup>
            <p>{message}</p>
          </Popup>
        </ModalOutside>
      )}
    </div>
  );
}

export default ErrorPopup;
