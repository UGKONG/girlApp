/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
import {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import store from '../src/store';
import {BluetoothDataRequestType} from '../src/types';

type Props = {type: BluetoothDataRequestType; id: string; value: number[]};
export default function () {
  const dispatch = store(x => x?.setState);
  const serviceUUID: string = 'FE60';
  const writeUUID: string = 'FE61';
  const [state, setState] = useState<null | Props>(null);

  const write = () => {
    if (!state?.type || !state?.value) return;

    BleManager.writeWithoutResponse(
      state?.id,
      serviceUUID,
      writeUUID,
      state?.value,
    )
      .then(() => {
        dispatch('bluetoothDataRequestType', state?.type);
        console.log(`BLE 요청: ${state?.type}, value: ${state?.value}`);
      })
      .catch(error => {
        console.log('error', error);
        dispatch('bluetoothDataRequestType', null);
      });
  };

  useEffect(() => {
    write();
  }, [state]);

  return setState;
}
