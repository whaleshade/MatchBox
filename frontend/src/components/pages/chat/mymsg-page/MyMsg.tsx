import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Layout from '../../../commons/layout/Layout';
import Footer from '../../../commons/footer/Footer';
import Header from '../../../commons/header/Header';
import MyMsgList from './sub-components/MyMsgList';
import CreateRoomIcon from '../../../../assets/icon/create-room-icon.svg';
import CreateRoom from '../chat-modal/createroom-modal/Createroom';
import { footerState } from '../../../../recoil/locals/footer/atoms/footerAtom';

export default function MyMsg() {
  const setFooterState = useSetRecoilState(footerState);
  const footer = useRecoilValue(footerState);
  const [isOpenCreateRoomModal, setIsOpenCreateRoomModal] =
    useState<boolean>(false);

  useEffect(() => {
    const setFooter = {
      channels: 'my',
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
      Header={<Header title="Channel" channelToggle toggleMove={false} />}
      Footer={<Footer tab="channel" />}
    >
      <CreateRoom
        isOpenCreateRoomModal={isOpenCreateRoomModal}
        handleClickModal={handleClickModal}
      />
      <BG>
        <MyMsgList />
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

/*
    Header와 Footer를 넣었을 떄
    return (
    <Layout
      Header={<Header title="My Messages" channelToggle toggleMove={false} />}
      Footer={<Footer tab="channel" />}
    >
      <div>mymsg</div>
    </Layout>
  );
*/
