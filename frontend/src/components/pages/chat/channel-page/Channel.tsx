import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Layout from '../../../commons/layout/Layout';
import ChannelList from './sub-components/ChannelList';
import Footer from '../../../commons/footer/Footer';
import Header from '../../../commons/header/Header';
import CreateRoomIcon from '../../../../assets/icon/create-room-icon.svg';
import CreateRoom from '../chat-modal/createroom-modal/Createroom';
import { footerState } from '../../../../recoil/locals/footer/atoms/footerAtom';

export default function Channel() {
  const setFooterState = useSetRecoilState(footerState);
  const footer = useRecoilValue(footerState);
  const [isOpenCreateRoomModal, setIsOpenCreateRoomModal] =
    useState<boolean>(false);

  useEffect(() => {
    const setFooter = {
      channels: 'all',
      friends: footer.friends,
    };
    setFooterState(setFooter);
  }, []);

  const handleClickModal = () => {
    setIsOpenCreateRoomModal(!isOpenCreateRoomModal);
  };

  const openModal = () => {
    setIsOpenCreateRoomModal(true);
  };

  return (
    <Layout
      Header={<Header title="Channel" channelToggle toggleMove />}
      Footer={<Footer tab="channel" />}
    >
      <CreateRoom
        isOpenCreateRoomModal={isOpenCreateRoomModal}
        handleClickModal={handleClickModal}
      />
      <BG>
        <ChannelList />
        <AddChannelButton onClick={openModal}>
          <Icon src={CreateRoomIcon} />
        </AddChannelButton>
      </BG>
    </Layout>
  );
}

const BG = styled.div`
  display: flex-start;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 82.5vh;
  background-color: #ffffff;
  padding-left: 3rem 0;
  padding-right: 3rem 0;
  position: relative;
`;

const AddChannelButton = styled.button`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background-color: #6d77af;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #ffffff;
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  flex: none;
  flex-grow: 0;
`;
