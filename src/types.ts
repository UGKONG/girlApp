import type {Dispatch, ReactElement, SetStateAction} from 'react';
import type {Peripheral, PeripheralInfo} from 'react-native-ble-manager';

export type Device = Peripheral;
export type ConnectedInfo = null | {
  id: string;
  detail: null | PeripheralInfo;
};
export type User = {
  USER_ID: number;
  USER_NAME: string;
  UESR_ACCOUNT: string;
};
export type SetConnectedInfo = Dispatch<SetStateAction<ConnectedInfo>>;
export type Store = {
  isModal: null | ReactElement;
  isLogin: null | User;
  activeScreen: null | string;
  setState?: any;
};
declare module '*.png';
