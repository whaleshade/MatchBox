import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Hamburger from '../../../assets/icon/hamburger.svg';
import BackButton from '../../../assets/icon/back.svg';

interface Props {
  title: string;
  channelToggle?: boolean;
  toggleMove?: boolean;
  friendToggle?: boolean;
  back?: boolean;
  backPath?: string;
  backClicked?: (() => void) | undefined;
  channelBurger?: boolean;
  handleClickSideModal?: (() => void) | undefined;
}

export default function Header({
  title,
  channelToggle = false,
  toggleMove = true,
  friendToggle = false,
  back = true,
  backPath = '',
  backClicked,
  channelBurger = false,
  handleClickSideModal,
}: Props) {
  const navigate = useNavigate();

  const handleBackClicked = () => {
    if (backClicked) {
      backClicked();
      navigate(backPath);
    }
  };

  return (
    <HeaderWrap>
      <HeaderBar>
        {backPath && (
          <Button onClick={handleBackClicked}>
            <ButtonImage src={BackButton} />
          </Button>
        )}
        <Title>{title}</Title>
        {channelToggle && (
          <Link
            to={toggleMove ? '/chat/mymsg' : '/chat/channel'}
            style={{ textDecoration: 'none' }}
          >
            <ToggleBtn>
              <Circle toggle={toggleMove} />
              <BtnText toggle={toggleMove}>{toggleMove ? 'ALL' : 'MY'}</BtnText>
            </ToggleBtn>
          </Link>
        )}
        {friendToggle && (
          <Link
            to={toggleMove ? '/friend/banned' : '/friend/list'}
            style={{ textDecoration: 'none' }}
          >
            <ToggleBtn>
              <Circle toggle={toggleMove} />
              <BtnText toggle={toggleMove}>
                {toggleMove ? 'FRD' : 'BAN'}
              </BtnText>
            </ToggleBtn>
          </Link>
        )}
        {channelBurger ? (
          <ButtonImage
            src={Hamburger}
            onClick={() => handleClickSideModal?.()}
          />
        ) : null}
      </HeaderBar>
    </HeaderWrap>
  );
}

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const Title = styled.div`
  font-family: 'NanumGothic';
  font-style: normal;
  font-weight: 400;
  font-size: 2rem;
  line-height: 2rem;

  display: flex;
  align-items: center;
  color: white;
  margin-right: auto;
  padding: 0rem 1rem 1rem;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0rem 0rem 5rem;
`;

const HeaderWrap = styled.header`
  padding: 1.4rem 2rem 1rem;
  height: 5.1rem;
  background: rgba(49, 60, 122, 1);
  opacity: 1;
  top: 0rem;
  left: 0rem;
`;

interface ToggleProps {
  toggle: boolean;
}

const ToggleBtn = styled.div`
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
const Circle = styled.div<ToggleProps>`
  background-color: #1eb640;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  ${props =>
    !props.toggle &&
    `
      transform: translate(2.6rem, 0);
      transition: all 0.3s ease-in-out;
    `}
`;

const BtnText = styled.span<ToggleProps>`
  ${props =>
    !props.toggle &&
    `
      transform: translate(-2rem, 0);
    `}
`;

const ButtonImage = styled.img`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  flex: none;
  flex-grow: 0;
`;
