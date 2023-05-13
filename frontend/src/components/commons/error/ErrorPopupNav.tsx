import styled from 'styled-components';
import { useEffect } from 'react';
import { To, useNavigate } from 'react-router-dom';

const Popup = styled.div`
  position: fixed;
  width: 40vh;
  height: 10vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -400%);
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

interface ErrorPopupProps {
  isErrorGet: boolean;
  message: string;
  handleErrorClose: () => void;
  moveTo?: To;
}

function ErrorPopupNav({
  isErrorGet,
  message,
  handleErrorClose,
  moveTo = ``,
}: ErrorPopupProps) {
  // 페이지 이동
  const navigate = useNavigate();

  useEffect(() => {
    if (isErrorGet) {
      const timeoutId = setTimeout(() => {
        handleErrorClose();
      }, 1500);

      return () => {
        clearTimeout(timeoutId);
        if (moveTo !== ``) {
          navigate(moveTo);
        }
      };
    }
    return undefined;
  }, [isErrorGet, moveTo]);

  return (
    <div>
      {isErrorGet && (
        <Popup>
          <p>{message}</p>
        </Popup>
      )}
    </div>
  );
}

export default ErrorPopupNav;
