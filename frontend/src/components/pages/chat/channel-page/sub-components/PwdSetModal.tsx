import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  display: ${({ show }: { show: boolean }) => (show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 2rem;
  border-radius: 5px;
  z-index: 1001;
`;

interface PwdSetModalProps {
  show: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

export default function PwdSetModal({
  show,
  handleClose,
  children,
}: PwdSetModalProps) {
  return (
    <ModalWrapper show={show} onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>{children}</ModalContent>
    </ModalWrapper>
  );
}
