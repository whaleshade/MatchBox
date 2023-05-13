import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useQueryClient } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isErrorOnGet } from '../../../../../recoil/globals/atoms/atom';
import ErrorPopup from '../../../../commons/error/ErrorPopup';
import PwdSetModal from './PwdSetModal';
import { channelIdState } from '../../../../../recoil/locals/chat/atoms/atom';
import { userState } from '../../../../../recoil/locals/login/atoms/atom';
import { useGetChannels } from '../../../../../api/Channel';

interface IChannel {
  channelId: string;
  channelName: string;
  count: number;
  password: string | null;
}

interface IChannelWrapper {
  channel: IChannel[];
}

export default function ChannelList() {
  // 리액트 쿼리
  const queryClient = useQueryClient();
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [isErrorGet, setIsErrorGet] = useRecoilState(isErrorOnGet);
  const [myChannelId, setMyChannelId] = useRecoilState(channelIdState);
  const [showModal, setShowModal] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userInfo = useRecoilValue(userState);
  const handleError = (error: AxiosError) => {
    if (error.response) {
      setIsErrorGet(true);
    }
  };
  const { data: channelLists } = useGetChannels(handleError);

  const navigate = useNavigate();

  const openModal = (channelId: string) => {
    setCurrentChannelId(channelId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPasswordInput('');
    setErrorMessage('');
  };

  const handleConfirm = async () => {
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/channels/${currentChannelId}/join`,
        { password: passwordInput },
        config,
      );
      closeModal();
      setMyChannelId(currentChannelId);
      navigate(`/chat/channel/${currentChannelId}`);
      queryClient.invalidateQueries('getChannels');
    } catch (err) {
      const e = err as AxiosError;
      if (e.response && e.response.status === 400) {
        setErrorMessage('틀렸습니다. 다시 입력하세요.');
      } else {
        setErrorMessage('요청을 처리할 수 없습니다.');
      }
    }
  };

  const enterOpenChannel = async (channelId: string) => {
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/channels/${channelId}/join`,
        { password: passwordInput },
        config,
      );
      setErrorMessage('');
      setMyChannelId(channelId);
      navigate(`/chat/channel/${channelId}`);
      queryClient.invalidateQueries('getChannels');
    } catch (err) {
      const e = err as AxiosError;
      if (e.response && e.response.status === 400) {
        setErrorMessage('틀렸습니다. 다시 입력하세요.');
      } else {
        setErrorMessage('요청을 처리할 수 없습니다.');
      }
    }
  };

  const handleClick = (channelId: string, password: string | null) => {
    if (password === null) {
      setPasswordInput('');
      enterOpenChannel(channelId);
    } else {
      openModal(channelId);
    }
  };

  useEffect(() => {
    if (channelLists) {
      const updateChaanelList = async () => {
        setChannels(channelLists.channel);
      };
      updateChaanelList();
    }
  }, [channelLists]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    channelId: string,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      openModal(channelId);
    }
  };

  return (
    <>
      <ErrorPopup message="요청을 처리할 수 없습니다." />
      <Outline>
        {channels.map(channel => (
          <List key={channel.channelId}>
            <ChannelItem>
              <div
                role="button"
                tabIndex={0}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  width: '100%',
                  height: '100%',
                }}
                onClick={() => handleClick(channel.channelId, channel.password)}
                onKeyDown={event => handleKeyDown(event, channel.channelId)}
              >
                <RoomTitle>
                  {channel.channelName} (현재인원: {channel.count}명){' '}
                </RoomTitle>
              </div>
            </ChannelItem>
          </List>
        ))}
      </Outline>
      <PwdSetModal show={showModal} handleClose={closeModal}>
        <ModalContent>
          <h2>비밀번호를 입력하세요.</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
          />
          <div>
            {errorMessage ? (
              <p style={{ color: 'red' }}>{errorMessage}</p>
            ) : (
              <p>나가려면 닫기를 누르세요.</p>
            )}
          </div>
        </ModalContent>
        <ButtonContainer>
          <button type="button" onClick={handleConfirm}>
            확인
          </button>
          <button type="button" onClick={closeModal}>
            닫기
          </button>
        </ButtonContainer>
      </PwdSetModal>
    </>
  );
}

const Outline = styled.ul`
  display: flex;
  margin-top: 0;
  flex-direction: column;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  gap: 0;
  height: inherit;
  overflow-y: auto;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 5rem;
  background-color: #ffffff;
  border: 1px solid #d8d8d8;
`;

const ChannelItem = styled.li`
  width: 100%;
  text-align: start;
  margin-left: 2rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
`;

const RoomTitle = styled.span`
  font-size: 1.5rem;
  color: #000000;
  text-decoration: none;
  color: inherit;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
