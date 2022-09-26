import type {Dispatch, SetStateAction} from 'react';
import type {Peripheral, PeripheralInfo} from 'react-native-ble-manager';

declare module '*.png';

export type Device = Peripheral;
export type ConnectedDevice = null | PeripheralInfo;
export type User = {
  USER_ID: number;
  USER_NAME: string;
  UESR_ACCOUNT: string;
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
export type LoginStaus = 'kakao_login_success' | 'naver_login_success';
