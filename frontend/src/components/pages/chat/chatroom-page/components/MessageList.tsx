import React from 'react';
import styled from '@emotion/styled';

export interface MessageType {
  senderId: string;
  content: string;
  timestamp: string;
}

const Base = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 0;
  width: 100%;
  > li {
    margin-top: -4rem;
  }

  > li + li {
    margin-top: 2.5rem;
  }
`;

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

export default function MessageList({ children }: Props) {
  return <Base>{children}</Base>;
}
