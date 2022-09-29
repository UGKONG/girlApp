import type {Dispatch, SetStateAction} from 'react';
import type {Peripheral, PeripheralInfo} from 'react-native-ble-manager';

declare module '*.png';

export type Device = Peripheral;
export type ConnectedDevice = null | PeripheralInfo;
export type User = {
  USER_ID: string;
  USER_NAME: string;
  PLATFORM: string;
};
export type SetState<T> = Dispatch<SetStateAction<T>>;
export type Store = {
  isModal: boolean;
  isMenu: boolean;
  isLogin: null | User;
  loginRequired: boolean;
  activeScreen: string | null;
  possibleDeviceList: string[];
  setState: (type: string, payload: any) => void;
};
export type LoginData = {id: string; pw: string};
export type DayObject = {
  dateString: string;
  timestamp: number;
  year: number;
  month: number;
  day: number;
};
export type SnsLoginList = {
  id: number;
  name: '카카오' | '네이버';
  img: string;
  color: string;
  onPress: () => void;
};
export type SnsLoginData = {
  platform: 'Kakao' | 'Naver';
  id: string;
  name: string;
};
export type NaverLoginPlatformKey = {
  kConsumerKey: string;
  kConsumerSecret: string;
  kServiceAppName: string;
  kServiceAppUrlScheme?: string;
};
