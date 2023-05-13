import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  background-color: white;
  margin: auto;
  max-width: 412px; //375px 디자인 사이즈
  height: 100vh;
  max-height: 915px; //812px 디자인 사이즈
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'nav'
    'main'
    'footer';
  text-align: center;
  grid-gap: 0.25rem;
`;

export const HeaderWrap = styled.header`
  grid-area: nav;
`;

export const MainWrap = styled.main`
  grid-area: main;
  overflow-y: auto;
`;

export const FooterWrap = styled.footer`
  grid-area: footer;
`;
