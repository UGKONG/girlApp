import type {Dispatch, SetStateAction} from 'react';
import type {Peripheral} from 'react-native-ble-manager';

export type Device = Peripheral;
export type User = {
  USER_ID: string;
  USER_NAME: string;
  PLATFORM: string;
};
export type SetState<T> = Dispatch<SetStateAction<T>>;
export type ConnectedDevice = {id: string; name: string};
export type BluetoothDataRequestType =
  | null
  | 'batteryV'
  | 'battery'
  | 'off'
  | 'on'
  | 'power'
  | 'mode'
  | 'timer';
export type Store = {
  isBluetoothReady: boolean;
  bluetoothDataRequestType: BluetoothDataRequestType;
  activeDevice: {
    id: string;
    name: string;
    battery: number;
    detail: Device;
  } | null;
  isModal: boolean;
  isMenu: boolean;
  isLogin: null | User;
  loginRequired: boolean;
  connectDeviceList: Device[];
  possibleDeviceName: string;
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
export type ConvertString = {
  stringToBytes: (str: string) => number[];
};
export type SendDataInfo = {
  id: string;
  serviceUUID: string;
  characteristicUUID?: string;
  value?: number[];
};
export type AsyncStorageError = Error | null | undefined;
export type AsyncStorageResult = string | null | undefined;
export type BluetoothDataResponse = {
  characteristic: string;
  peripheral: string;
  service: string;
  value: any;
};
