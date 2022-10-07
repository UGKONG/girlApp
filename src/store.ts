import createStore from 'zustand';
import type {Store} from './types';

export default createStore<Store>(set => ({
  isBluetoothReady: false,
  bluetoothDataRequestType: null,
  activeDevice: null,
  isModal: false,
  isMenu: false,
  isLogin: null,
  loginRequired: false,
  connectDeviceList: [],
  possibleDeviceName: 'DoNoLUNA',
  setState: (type: string, payload: any) =>
    set((state: Store): Store => ({...state, [type]: payload})),
}));
