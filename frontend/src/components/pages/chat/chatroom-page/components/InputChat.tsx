import React, { useRef, useState } from 'react';
import styled from '@emotion/styled/macro';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { BsPlusSquare } from 'react-icons/bs';
import defaultTheme from '../../../../../styles/theme';
import { ISendedMessage } from '..';

const Base = styled.div<{ borderColor: string; backgroundColor: string }>`
  width: 100%;
  height: 4.8rem;
  box-sizing: border-box;
  border-top: 1rem solid ${({ borderColor }) => borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding: 0.4rem;
`;

const PlusButtonWrapper = styled.div``;

const PlusButton = styled.button`
  width: 4.8rem;
  height: 4.8rem;
  font-size: 2rem;
  border: none;
  background-color: transparent;
`;

const InputWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Input = styled.input<{ borderColor: string; backgroundColor: string }>`
  border: 0.1rem solid ${({ borderColor }) => borderColor};
  background-color: transparent;
  border-radius: 1.6rem;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0.4rem 0.8rem;
  font-size: 1.6rem;
`;

const SendButtonWrapper = styled.div`
  margin-left: 0.8rem;
  box-sizing: border-box;
`;

const SendButton = styled.button<{ backgroundColor: string }>`
  border: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  font-size: 1.6rem;
  opacity: 0.9;
  &:active {
    opacity: 0.6;
  }
`;

interface Props {
  onClick(content: ISendedMessage): void;
  channelId?: string;
}

export default function InputChat({ onClick, channelId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleClick = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!channelId) {
      return;
    }

    const sendedMessage: ISendedMessage = {
      channelId,
      message: content,
      time: new Date(),
    };

    if (inputRef.current?.value) {
      onClick(sendedMessage);
      setContent('');
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      // isComposing 이 true 이면
      return; // 조합 중이므로 동작을 막는다.
    }

    if (e.key === 'Enter') {
      // [Enter] 치면 메시지 보내기
      handleClick(e);
    }
  };

  return (
    <Base
      borderColor={defaultTheme.colors.white}
      backgroundColor={defaultTheme.colors.white}
    >
      <PlusButtonWrapper>
        <PlusButton>
          <BsPlusSquare />
        </PlusButton>
      </PlusButtonWrapper>
      <InputWrapper>
        <Input
          ref={inputRef}
          borderColor={defaultTheme.colors.brightGray}
          backgroundColor={defaultTheme.colors.middleGray}
          onChange={handleChange}
          onKeyDownCapture={handleKeyDown}
        />
      </InputWrapper>
      <SendButtonWrapper>
        <SendButton
          backgroundColor={defaultTheme.colors.green}
          onClick={e => handleClick(e)}
        >
          <AiOutlineArrowUp />
        </SendButton>
      </SendButtonWrapper>
    </Base>
  );
}
