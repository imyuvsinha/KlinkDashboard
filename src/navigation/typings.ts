import {NativeStackScreenProps} from '@react-navigation/native-stack';

export enum ScreenNames {
  Home = 'Home',
}

export type RootStackParamList = {
  [ScreenNames.Home]: undefined;
};

export type NavProps<ScreenName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, ScreenName>;
