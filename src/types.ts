import type {Dispatch, ReactElement, SetStateAction} from 'react';
import type {Peripheral, PeripheralInfo} from 'react-native-ble-manager';

declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';
// declare module '*.gif';

export type Device = Peripheral;
export type ConnectedInfo = null | {
  id: string;
  detail: null | PeripheralInfo;
};
export type User = {
  USER_ID: number;
  USER_NAME: string;
  UESR_ACCOUNT: string;
  PLATFORM: string;
};
export type Setting = {
  lang: 'en' | 'ko';
  color: string;
};
export type DefaultSetting = {
  lang: 'en';
  color: '#8ba7c0';
};
export type SetConnectedInfo = Dispatch<SetStateAction<ConnectedInfo>>;
export type Store = {
  setting: Setting;
  isModal: null | ReactElement;
  isMenu: boolean;
  isLogin: null | User;
  activeScreen: string;
  setState?: any;
};
export type DurationList = ['5', '10', '15', '20'];
export type StrengthList = ['1', '2', '3', '4'];
export type Duration = null | '5' | '10' | '15' | '20';
export type Strength = null | '1' | '2' | '3' | '4';
export type LoginData = {id: string; pw: string};
