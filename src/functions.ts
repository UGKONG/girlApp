/* eslint-disable no-bitwise */
import create from 'zustand';
import type {Store} from './types';

export const store = create<Store>(set => ({
  isModal: false,
  isMenu: false,
  isLogin: null,
  loginRequired: false,
  activeScreen: null,
  possibleDeviceList: ['DoNoLUNA-0228'],
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

export const useDate = (
  dt: Date = new Date(),
  type: string = 'all',
  format: boolean = false,
): string => {
  let date = new Date(dt);
  let Y = date.getFullYear();
  let M =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  let resultDate = format
    ? Y + '년' + M + '월' + D + '일'
    : Y + '-' + M + '-' + D;
  let resultTime = format
    ? h + '시' + m + '분' + s + '초'
    : h + ':' + m + ':' + s;
  let result = null;
  if (type === 'date') {
    result = resultDate;
  } else if (type === 'time') {
    result = resultTime;
  } else {
    result = resultDate + ' ' + resultTime;
  }

  return result;
};
