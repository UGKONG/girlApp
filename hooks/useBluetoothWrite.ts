/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */

import {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import BleManager from 'react-native-ble-manager';
import store from '../src/store';
import {BluetoothDataRequestType} from '../src/types';

type Props = {
  type: BluetoothDataRequestType;
  value: number[];
  isAuto?: boolean;
};
export default function () {
  const dispatch = store(x => x?.setState);
  const activeDevice = store(x => x?.activeDevice);
  const LANG = store(x => x?.lang);
  const serviceUUID: string = 'FE60';
  const writeUUID: string = 'FE61';
  const [state, setState] = useState<null | Props>(null);

  type WriteResponse = {type: BluetoothDataRequestType; value: string | number};

  // Write 성공
  const success = ({
    type,
    value,
    isAuto,
  }: WriteResponse & {isAuto?: boolean}) => {
    dispatch('bluetoothDataRequest', {type, isAuto: isAuto ?? false});
    console.log('-> BLE 요청: ' + type + ', value: ' + value);
  };

  // Write 실패
  const fail = (error: Error) => {
    Toast.show({
      type: 'error',
      text1: LANG === 'ko' ? '장비' : 'Device',
      text2:
        LANG === 'ko' ? '장비와 연결이 해제되었습니다.' : 'Device disconnected',
    });
    console.log('Error', error);
    dispatch('activeDevice', null);
    dispatch('bluetoothDataRequest', null);
    dispatch('isBluetoothReady', false);
    dispatch('remoteState', null);
  };

  const write = (): void => {
    // Validate
    if (!state || !activeDevice) return;
    let id = activeDevice?.id;
    let type = state?.type;
    let isAuto = state?.isAuto;
    let value: number | string = state?.value[0];
    value = value?.toString(16);

    if (type === 'init' && value !== '30') return;
    if (type === 'battery' && value !== '30') return;
    if (type === 'batteryV' && value !== '20') return;
    if (type === 'mode' && value[0] !== '7') return;
    if (type === 'power' && value[0] !== '5') return;
    if (type === 'timer' && value[0] !== '1') return;
    if (type === 'on' && value !== '42') return;
    if (type === 'off' && value !== '40') return;

    BleManager.writeWithoutResponse(id, serviceUUID, writeUUID, state?.value)
      .then(() => success({type, value, isAuto}))
      .catch((error: Error) => fail(error));
  };

  useEffect(write, [state]);

  return setState;
}
