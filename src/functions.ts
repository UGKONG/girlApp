/* eslint-disable no-bitwise */
import create from 'zustand';
import type {Store} from './types';

export const store = create<Store>(set => ({
  setting: {lang: 'en', color: '#8ba7c0'},
  isModal: null,
  isMenu: false,
  isLogin: null,
  activeScreen: 'home',
  setState: (type: string, payload: any) =>
    set((state: Store): Store => ({...state, [type]: payload})),
}));

export const stringToBytes = (str: string) => {
  let ch: any = [];
  let st: any = [];
  let re: any = [];

  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i);
    st = [];

    do {
      st.push(ch & 0xff);
      ch = ch >> 8;
    } while (ch);
    re = re.concat(st.reverse());
  }
  return re;
};
