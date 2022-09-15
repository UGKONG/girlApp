/* eslint-disable no-bitwise */
import create from 'zustand';
import type {Store} from './types';

export const store = create<Store>(set => ({
  isModal: null,
  isLogin: null,
  activeScreen: null,
  setState: (type: 'isLogin' | 'activeScreen', payload: any) =>
    set((state: {[key: string]: any}) => {
      if (!type) {
        return console.warn('type is not found!!');
      }
      if (typeof type !== 'string') {
        return console.warn('type is not string!!');
      }
      return (state[type] = payload);
    }),
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
