import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    shadow: {
      defaultShadow: string;
    };
    colors: {
      polarBlue: string;
      backgroundPink: string;
      brightBlue: string;
      black: string;
      brightGray: string;
      inputBoxColor: string;
      simpleGray: string;
      darkGray: string;
      red: string;
      yellow: string;
      green: string;
      slightBlue: string;
      white: string;
      middleGray: string;
      polarMiddleBlue: string;
      backgroundGray: string;
    };

    fontWeight: {
      weightRegular: string;
      weightBold: string;
      weightExtraBold: string;
    };

    mobileFontSize: {
      sizeSmall: string;
      sizeMedium: string;
      sizeLarge: string;
    };

    font: {
      sebangGothic: string;
      nanumGothic: string;
    };

    typography: {
      bigSebang: string;
      middleSebang: string;
      smallSebang: string;
      boldBigSebang: string;
      boldMiddleSebang: string;
      boldSmallSebang: string;
      bigNanum: string;
      middleNanum: string;
      smallNanum: string;
      boldBigNanum: string;
      boldMiddleNanum: string;
      boldSmallNanum: string;
      ExtraBoldBigNanum: string;
      ExtraBoldMiddleNanum: string;
      ExtraBoldSmallNanum: string;
    };

    zIndex: {
      header: string;
      footer: string;
      headerNav: string;
      modal: string;
      loading: string;
      error: string;
    };
  }
}
