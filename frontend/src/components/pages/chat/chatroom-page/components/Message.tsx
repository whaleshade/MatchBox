import React from 'react';
import styled from '@emotion/styled';

import { MessageType } from './MessageList';
import defaultTheme from '../../../../../styles/theme';
import { IProfile } from '..';

interface ReceivedMessage extends MessageType {
  receiver: string;
  receiverThumbnailImage?: string;
}

const Base = styled.li`
  display: flex;
  width: 100%;
`;

const Image = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  margin-right: 1rem;
`;

const Content = styled.div``;

const Profile = styled.div`
  display: flex;
  justify-content: start;
  align-items: end;
`;

const UserName = styled.span`
  font-weight: ${defaultTheme.fontWeight.weightExtraBold};
  opacity: 0.8;
  font-size: 1.4rem;
`;

const Info = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 0.5rem;
`;

const SpeechBubble = styled.span<{ backgroundColor: string }>`
  display: block;
  text-align: left;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 0 1.5rem 1.5rem 1.5rem;
  margin-right: 0.5rem;
  padding: 1.3rem;
  font-size: 1.8rem;
  max-width: 30rem; // 적절한 최대 너비를 설정하세요
  opacity: 0.8;
`;

const ReceivedAt = styled.span`
  font-size: 1.2rem;
  color: ${defaultTheme.colors.darkGray};
  opacity: 0.8;
  margin-left: 0.8rem;
`;

export function Message({
  receiverThumbnailImage,
  receiver,
  timestamp,
  content,
  message,
  onClickCapture,
  onClick,
}: IProfile) {
  const formatTimestamp = (time: string) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours %= 12;
    hours = hours !== 0 ? hours : 12;
    const minutesAsString = minutes < 10 ? `0${minutes}` : minutes;

    const formattedTime = `${hours}:${minutesAsString}${ampm}`;
    return formattedTime;
  };

  const formatContent = (text: string) => {
    const words = text.split(/\s+/);
    const lines: string[] = [];

    let currentLine = '';
    const maxLength = 25; // 줄바꿈이 적용되는 최대 문자열 길이
    for (let i = 0; i < words.length; i += 1) {
      const word = words[i];
      if (word.length > maxLength) {
        // 단어 자체가 maxLength보다 길다면
        for (let j = 0; j < word.length; j += maxLength) {
          lines.push(word.slice(j, j + maxLength));
        }
      } else if (currentLine.length + word.length + 1 <= maxLength) {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    const result = lines.join(`\n`);

    return result;
  };

  return (
    <Base onClickCapture={() => onClickCapture(message)}>
      <Image
        src={receiverThumbnailImage}
        alt={`${receiver}의 썸네일`}
        onClick={onClick}
      />
      <Content>
        <Profile>
          <UserName>{receiver}</UserName>
          <ReceivedAt>{formatTimestamp(timestamp)}</ReceivedAt>
        </Profile>
        <Info>
          <SpeechBubble backgroundColor={defaultTheme.colors.yellow}>
            {formatContent(content)}
          </SpeechBubble>
        </Info>
      </Content>
    </Base>
  );
}
