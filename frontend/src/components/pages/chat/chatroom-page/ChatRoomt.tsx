import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Socket, io } from 'socket.io-client';
import { useRecoilState, useRecoilValue } from 'recoil';
import { To, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../../commons/layout/Layout';
import InputChat from './components/InputChat';
import MessageList from './components/MessageList';
import { Message } from './components/Message';
import Header from '../../../commons/header/Header';
import { IChat, IError, IKick, ISendedMessage, NError, OError } from '.';
import { getDefaultImageUrl, getImageUrl } from '../../../../api/ProfileImge';
import { useNewChatMessageHandler } from './hooks';
import { useGetChatRoomLog, useUserChannel } from '../../../../api/Channel';
import RoomSide from '../chat-modal/roomside-modal/RoomSide';
import Profile, {
  Member,
  initialMember,
} from '../../../commons/modals/profile-modal/Profile';
import ErrorPopupNav from '../../../commons/error/ErrorPopupNav';
import { userState } from '../../../../recoil/locals/login/atoms/atom';

const Base = styled.div`
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 6.4rem;
  align-items: center;
  padding: 0 2.4rem;
`;

export default function ChatRoom() {
  const [isOpenSideModal, setIsOpenSideModal] = useState<boolean>(false);

  const handleClickSideModal = () => {
    setIsOpenSideModal(!isOpenSideModal);
  };

  const socketRef = useRef<Socket | null>(null);
  const scrollBottomRef = useRef<HTMLLIElement>(null);
  const { id } = useParams<string>();
  const [messages, setMessages] = useState<Array<IChat>>([]);
  const userInfo = useRecoilValue(userState);
  const [channelName, setChannelName] = useState<string>('Channel');

  // 에러 모달
  const [isErrorGet, setIsErrorGet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [moveTo, setMoveTo] = useState<To>(``);
  const handleHideErrorModal = () => {
    setIsErrorGet(false);
  };
  const {
    data: chatListData,
    isLoading,
    isError,
  } = useGetChatRoomLog(id || '');
  // 유저 본인 - isAdmin
  const { data: userChannel } = useUserChannel(userInfo.userId, id || '');
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const handleNewChatMessage = useNewChatMessageHandler(userInfo, setMessages);
  const navigate = useNavigate();

  const handleSend = (content: ISendedMessage) => {
    socketRef.current?.emit('chat', content, handleNewChatMessage);
  };

  useEffect(() => {
    socketRef.current = io(
      `${process.env.REACT_APP_BASE_BACKEND_URL}/channel`,
      {
        path: '/socket.io',
        extraHeaders: {
          authorization: `Bearer ${userInfo.token}`,
        },
      },
    );

    socketRef.current.emit('enterChannel', { channelId: id });

    socketRef.current.on('error', (error: IError | NError | OError) => {
      setIsErrorGet(true);
      setMoveTo(`/chat/mymsg`);
      if ('UnauthorizedException' in error) {
        setErrorMessage(error.UnauthorizedException);
      } else if ('NotFoundException' in error) {
        setMoveTo(``);
        setErrorMessage(error.NotFoundException);
      } else if ('NotFoundExceptionOut' in error) {
        setErrorMessage(error.NotFoundExceptionOut);
      } else {
        setErrorMessage('[소켓 연결 에러] 채팅방에 입장할 수 없습니다 ');
      }
    });
    socketRef.current.on('chat', handleNewChatMessage);
    socketRef.current.on('kicked', (data: IKick) => {
      if (data.channelId === id && data.targetId === userInfo.userId) {
        setIsErrorGet(true);
        setMoveTo(`/chat/mymsg`);
        setErrorMessage('KICKED');
      }
    });

    return () => {
      socketRef.current?.off('error');
      socketRef.current?.off('chat');
      socketRef.current?.off('message');
      socketRef.current?.off('kicked');
      socketRef.current?.close();
    };
  }, []);

  const handleKickClicked = (targetId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('kick', {
        channelId: id,
        targetId,
      });
      // window.location.reload();
    }
  };

  const handleBackClicked = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    if (chatListData) {
      setChannelName(chatListData.channel.channelName);
      const updateMessages = async () => {
        const updatedMessages = await Promise.all(
          chatListData.chat.map(async message => {
            let imageUrl;
            if (message.userChannel.user.userId === '') {
              // 디폴트 사진으로 바꿈.
              imageUrl = await getDefaultImageUrl(userInfo.token);
            } else {
              imageUrl = await getImageUrl(
                message.userChannel.user.userId,
                userInfo.token,
              );
            }

            return {
              ...message,
              userChannel: {
                ...message.userChannel,
                user: {
                  ...message.userChannel.user,
                  image: imageUrl,
                },
              },
            };
          }),
        );
        setMessages(updatedMessages);
      };
      updateMessages();
    }
  }, [chatListData]);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setIsAdmin(userChannel?.isAdmin);
  }, [userChannel]);

  // 유저 프로필 모달
  const [isOpenProfileModal, setIsOpenProfileModal] = useState<boolean>(false);
  const handleClickProfileModal = async () => {
    setIsOpenProfileModal(!isOpenProfileModal);
  };

  const [selectedUser, setSelectedUser] = useState<Member>(initialMember);
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const handleSelectChat = async (message: IChat) => {
    const member: Member = {
      userId: message.userChannel.user.userId,
      intraId: message.userChannel.user.intraId,
      nickname: message.userChannel.user.nickname,
      image: '',
      isMute: message.userChannel.isMute,
    };
    if (message.userChannel.user.userId !== '') {
      member.image = await getImageUrl(member.userId, userInfo.token);
    } else {
      member.image = await getDefaultImageUrl(userInfo.token);
    }
    setSelectedUser(member);
    setSelectedChat(message);
    setIsOpenProfileModal(true);
  };

  return (
    <Layout
      Header={
        isErrorGet ? (
          <Header title={channelName} backPath="/chat/mymsg" />
        ) : (
          <Header
            title={channelName}
            channelBurger
            handleClickSideModal={handleClickSideModal}
            backPath="/chat/mymsg"
            backClicked={handleBackClicked}
          />
        )
      }
      Footer={<InputChat onClick={handleSend} channelId={id} />}
    >
      {isOpenProfileModal && selectedChat && (
        <Profile
          handleClickModal={handleClickProfileModal}
          user={selectedUser}
          inChat
          channelInfo={{
            channelId: id || '',
            isAdmin,
          }}
          handleKickClicked={handleKickClicked}
        />
      )}
      <RoomSide
        isOpenSideModal={isOpenSideModal}
        handleClickModal={handleClickSideModal}
        channelInfo={{
          channelId: id || '',
          isDm: chatListData?.channel.isDm,
        }}
      />
      <Base>
        <Container>
          {isErrorGet ? (
            <ErrorPopupNav
              isErrorGet={isErrorGet}
              message={errorMessage}
              handleErrorClose={handleHideErrorModal}
              moveTo={moveTo}
            />
          ) : (
            <MessageList>
              {messages.map((message: IChat) => (
                <Message
                  key={message.chatId}
                  receiver={message.userChannel.user.nickname}
                  receiverThumbnailImage={message.userChannel.user.image}
                  content={message.message}
                  timestamp={message.time}
                  message={message}
                  onClickCapture={handleSelectChat}
                  onClick={handleClickProfileModal}
                />
              ))}
              <li ref={scrollBottomRef} />
            </MessageList>
          )}
        </Container>
      </Base>
    </Layout>
  );
}
