import {DefaultTheme, Theme} from '@react-navigation/native';

//UPDATE ALL COLOR CODES
interface ExtendedTheme extends Theme {
  colors: Theme['colors'] & {
    gray: string;
    commonWhite: string;
    commonBlack: string;
    secondary: string;
    white: string;
    icon: string;
    bottomsheet: string;
  };
}

const commonColor = {
  colors: {
    commonWhite: '#FFFFFF',
    commonBlack: '#000000',
  },
};

const singlularTheme: ExtendedTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...commonColor,
    ...DefaultTheme.colors,
    background: '#0F0F0F',
    primary: '#674EFF',
    secondary: '#111928',
    icon: '#9583FF',
    text: '#111928',
    white: '#FFFFFF',
    gray: '#A7A5A3',
    border: '#313130',
    bottomsheet: '#1E1D1D',
  },
};

declare module '@react-navigation/native' {
  export function useTheme(): ExtendedTheme;
}

export default {
  singlularTheme,
};
