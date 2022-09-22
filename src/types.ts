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
export type SetConnectedDevice = Dispatch<SetStateAction<ConnectedDevice>>;
export type Store = {
  isModal: boolean;
  isMenu: boolean;
  isLogin: null | User;
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

let a = {
  advertising: {
    isConnectable: true,
    localName: 'DoNoLUNA-0228',
    manufacturerData: {
      CDVType: 'ArrayBuffer',
      bytes: [Array],
      data: 'AgEGAwNg/g4JRG9Ob0xVTkEtMDIyOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
    },
    serviceData: {},
    serviceUUIDs: ['fe60'],
    txPowerLevel: -2147483648,
  },
  id: 'FA:19:8C:63:46:9A',
  name: 'DoNoLUNA-0228',
  rssi: -61,
};
