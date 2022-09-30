import createStore from 'zustand';
import type {Store} from './types';

export default createStore<Store>(set => ({
  activeDevice: null,
  isModal: false,
  isMenu: false,
  isLogin: null,
  loginRequired: false,
  activeScreen: null,
  possibleDeviceList: ['DoNoLUNA-0228'],
  setState: (type: string, payload: any) =>
    set((state: Store): Store => ({...state, [type]: payload})),
}));
