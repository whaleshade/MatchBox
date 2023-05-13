import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import GameIcon from '../../../assets/icon/game-icon.svg';
import ChatIcon from '../../../assets/icon/chat-icon.svg';
import FriendIcon from '../../../assets/icon/friend-icon.svg';
import MyIcon from '../../../assets/icon/my-icon.svg';
import GameIconClicked from '../../../assets/icon/game-icon-clicked.svg';
import ChatIconClicked from '../../../assets/icon/chat-icon-clicked.svg';
import FriendIconClicked from '../../../assets/icon/friend-icon-clicked.svg';
import MyIconClicked from '../../../assets/icon/my-icon-clicked.svg';
import { footerState } from '../../../recoil/locals/footer/atoms/footerAtom';

interface Props {
  tab: string;
}

export default function Footer({ tab }: Props) {
  const footer = useRecoilValue(footerState);
  return (
    <FooterWrap>
      <Link to="/game/shop">
        <ButtonImage src={tab === 'game' ? GameIconClicked : GameIcon} />
      </Link>
      <Link to={footer.channels === 'all' ? '/chat/channel' : '/chat/mymsg'}>
        <ButtonImage src={tab === 'channel' ? ChatIconClicked : ChatIcon} />
      </Link>
      <Link to={footer.friends === 'frd' ? '/friend/list' : '/friend/banned'}>
        <ButtonImage src={tab === 'friend' ? FriendIconClicked : FriendIcon} />
      </Link>
      <Link to="/profile/my">
        <ButtonImage src={tab === 'my' ? MyIconClicked : MyIcon} />
      </Link>
    </FooterWrap>
  );
}

const ButtonImage = styled.img`
  width: 25%;
  height: 4.4rem;
  cursor: pointer;
  flex: none;
  flex-grow: 0;
`;

const FooterWrap = styled.footer`
  padding: 1rem 2rem 0.8rem;
  left: 0rem;
  top: 74.4rem;
  height: 6.8rem;
  border-top: 0.1rem solid #d3d3d3;
`;
