/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import BleManager from 'react-native-ble-manager';
import store from '../src/store';
import {BluetoothDataRequestType} from '../src/types';

type Props = {
  type: BluetoothDataRequestType;
  id: string;
  value: number[];
  isAuto?: boolean;
};
export default function () {
  const dispatch = store(x => x?.setState);
  const activeDevice = store(x => x?.activeDevice);
  const serviceUUID: string = 'FE60';
  const writeUUID: string = 'FE61';
  const [state, setState] = useState<null | Props>(null);

  const write = (): void => {
    // Validate
    if (!state || !activeDevice) return;
    let id = state?.id;
    let type = state?.type;
    let isAuto = state?.isAuto;
    let val: number | string = state?.value[0];
    val = val?.toString(16);

    if (type === 'init' && val !== '30') return;
    if (type === 'battery' && val !== '30') return;
    if (type === 'batteryV' && val !== '20') return;
    if (type === 'mode' && val[0] !== '7') return;
    if (type === 'power' && val[0] !== '5') return;
    if (type === 'timer' && val[0] !== '8') return;
    if (type === 'on' && val !== '42') return;
    if (type === 'off' && val !== '40') return;

    BleManager.writeWithoutResponse(id, serviceUUID, writeUUID, state?.value)
      .then(() => {
        dispatch('bluetoothDataRequest', {type, isAuto: isAuto || false});
        console.log('-> BLE 요청: ' + type + ', value: ' + val);
      })
      .catch(error => {
        console.log('Error', error);
        dispatch('activeDevice', null);
        dispatch('bluetoothDataRequest', null);
        Alert.alert('LUNA', '장비와 연결이 해제되었습니다.');
      });
  };

  useEffect(write, [state]);

  return setState;
}
