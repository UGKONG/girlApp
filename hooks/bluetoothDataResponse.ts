/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import store from '../src/store';
import type {BluetoothDataResponse} from '../src/types';

export default function () {
  const dispatch = store(x => x?.setState);
  const type = store(x => x?.bluetoothDataRequestType);
  const activeDevice = store(x => x?.activeDevice);
  const [data, setData] = useState<null | BluetoothDataResponse>(null);

  // 응답에 대한 로직
  const response = () => {
    if (!type || !data) return;
    console.log('BLE 응답:', type, data?.value[0]);
    if (type === 'battery') {
      let [val] = data?.value;
      val = Number(String(val)?.slice(1) + '0');
      dispatch('activeDevice', {...activeDevice, battery: val});
    }
  };

  useEffect(response, [data]);

  return setData;
}
