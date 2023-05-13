import React, { ReactNode } from 'react';
import { Container, FooterWrap, HeaderWrap, MainWrap } from './MainGrind';

interface Props {
  Header?: ReactNode;
  Footer?: ReactNode;
  children: ReactNode;
}

export default function Layout({
  Header = null,
  Footer = null,
  children,
}: Props) {
  return (
    <div>
      <Container>
        {Header && <HeaderWrap>{Header}</HeaderWrap>}
        <MainWrap>{children}</MainWrap>
        {Footer && <FooterWrap>{Footer}</FooterWrap>}
      </Container>
    </div>
  );
}
