import React, { useCallback } from 'react';
import { IChat } from '..';
import { getImageUrl } from '../../../../../api/ProfileImge';

interface IUserInfo {
  token: string;
  userId: string;
  nickname: string;
  imageUrl: string;
}

export function useNewChatMessageHandler(
  userInfo: IUserInfo,
  setMessages: React.Dispatch<React.SetStateAction<IChat[]>>,
) {
  const handleNewChatMessage = useCallback(
    async (newMessage: IChat) => {
      const imageUrl = await getImageUrl(
        newMessage.userChannel.user.userId,
        userInfo.token,
      );
      const messageWithImage = {
        ...newMessage,
        userChannel: {
          ...newMessage.userChannel,
          user: {
            ...newMessage.userChannel.user,
            image: imageUrl,
          },
        },
      };

      setMessages((prevMessages: IChat[]) => [
        ...prevMessages,
        messageWithImage,
      ]);
    },
    [userInfo.token, setMessages],
  );

  return handleNewChatMessage;
}
