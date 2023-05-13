import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  toggle: boolean;
}

interface ToggleProps {
  toggleChange: boolean;
}

export default function Toggle({ toggleChange }: ToggleProps) {
  const [btnText, setBtnText] = useState('ALL');
  const clickedToggle = () => {
    setBtnText(prev => (prev === 'ALL' ? 'MY' : 'ALL'));
  };
  return (
    <Link to={toggleChange ? '/chat/channel' : '/chat/mymsg'}>
      <ToggleBtn onClick={clickedToggle} toggle={toggleChange}>
        <Circle toggle={toggleChange} />
        <BtnText toggle={toggleChange}>{btnText}</BtnText>
      </ToggleBtn>
    </Link>
  );
}

const ToggleBtn = styled.button<Props>`
  padding: 0rem 0rem 0rem;
  width: 5rem;
  height: 2.35rem;
  top: 0.1rem;
  left: 0rem;
  border-radius: 3rem;
  border: none;
  cursor: pointer;
  background: rgba(225, 227, 238, 1);
  display: flex;
  align-items: center;
  transition: all 0.5s ease-in-out;
`;
const Circle = styled.div<Props>`
  background-color: #1eb640;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  ${props =>
    props.toggle &&
    `
      transform: translate(2.6rem, 0);
      transition: all 0.3s ease-in-out;
    `}
`;

const BtnText = styled.span<Props>`
  ${props =>
    props.toggle &&
    `
      padding: 0rem 0.5rem 0rem;
      transform: translate(-2.6rem, 0);
    `}
`;
