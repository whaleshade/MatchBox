import React from 'react';
import styled from 'styled-components';

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

export default function Popup({ onClose, children }: Props) {
  return (
    <ModalOutside onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <XButton onClick={onClose}>&times;</XButton>
        {children}
      </ModalContainer>
    </ModalOutside>
  );
}

export function NoXPopup({ onClose, children }: Props) {
  return (
    <ModalOutside onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        {children}
      </ModalContainer>
    </ModalOutside>
  );
}

export const ModalOutside = styled.div`
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, 0%);
  width: 412px;
  max-height: 915px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 300;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #ffffff;
  border-top: none;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.2);

  position: absolute;
  width: 32rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
`;

export const XButton = styled.strong`
  position: absolute;
  top: 0;
  right: 0.3rem;
  font-size: 2.5rem;
  color: #c2c2c2;
  cursor: pointer;
  font-weight: bold;
  margin: 1rem;
`;
