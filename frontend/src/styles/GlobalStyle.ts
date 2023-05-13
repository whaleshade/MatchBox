import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';
import defaultTheme from './theme';

const GlobalStyle = createGlobalStyle`
  ${normalize};
  * {
    box-sizing: border-box;
  }
  button {
    font-family: ${defaultTheme.font.sebangGothic};
  }
  body {
    height: 100%;
    font-family: ${defaultTheme.font.nanumGothic};
    margin: 0;
    padding: 0;
  }
  html {
    font-size: 10px;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;
export default GlobalStyle;
