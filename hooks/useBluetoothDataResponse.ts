/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import store from '../src/store';
import useBluetoothWrite from './useBluetoothWrite';
import type {BluetoothDataResponse} from '../src/types';

export default function () {
  const bleWrite = useBluetoothWrite();
  const dispatch = store(x => x?.setState);
  const bluetoothDataRequest = store(x => x?.bluetoothDataRequest);
  const activeDevice = store(x => x?.activeDevice);
  const remoteState = store(x => x?.remoteState);
  const [data, setData] = useState<null | BluetoothDataResponse>(null);

  // 응답에 대한 로직
  const response = () => {
    if (!bluetoothDataRequest || !data || !activeDevice) return;

    let type = bluetoothDataRequest?.type;
    let isAuto = bluetoothDataRequest?.isAuto;
    let val: number | string = data?.value[0];
    val = val?.toString(16);
    console.log('<- BLE 응답: ' + type + ', value: ' + val);

    // Validate
    if (val !== '41') {
      if (type === 'mode' && val[0] !== '7') return;
      if (type === 'power' && val[0] !== '5') return;
      if (type === 'timer' && val[0] !== '1') return;
      if (type === 'on' && val !== '43') return;
      if (type === 'off' && val !== '41') return;
    } else {
      // 장비 정지 로직
      return dispatch('activeDevice', {
        ...activeDevice,
        isOn: false,
      });
    }

    // 연결 시 첫 배터리 요청에 대한 응답이 왔을 때..
    if (type === 'init') {
      let strBattery: string = String(val);
      let battery: number = 0;

      if (strBattery === 'a') {
        battery = 100;
      } else {
        battery = Number(strBattery?.slice(1) + '0');
      }
      dispatch('activeDevice', {...activeDevice, battery: battery});

      return bleWrite({
        type: 'mode',
        value: [0x70 + (remoteState?.mode ?? 1)],
        isAuto: true,
      });
    } else if (type === 'battery') {
      // 배터리에 대한 응답이 왔을 때..
      let strBattery: string = String(val);
      let battery: number = 0;

      if (strBattery === 'a') {
        battery = 100;
      } else {
        battery = Number(strBattery?.slice(1) + '0');
      }
      return dispatch('activeDevice', {...activeDevice, battery: battery});
    } else if (type === 'mode') {
      // 모드에 대한 응답이 왔을 때..
      val = Number(String(val)?.slice(-1));
      dispatch('remoteState', {...remoteState, mode: val});

      if (isAuto) {
        bleWrite({
          type: 'power',
          value: [0x50 + (remoteState?.power ?? 2)],
          isAuto: true,
        });
      }
      return;
    } else if (type === 'power') {
      // 에너지에 대한 응답이 왔을 때..
      val = Number(String(val)?.slice(-1));
      dispatch('remoteState', {...remoteState, power: val});

      if (isAuto) {
        bleWrite({
          type: 'timer',
          value: [0x10 + (remoteState?.timer ?? 7)],
          isAuto: true,
        });
      }
      return;
    } else if (type === 'timer') {
      // 타이머에 대한 응답이 왔을 때..
      val = Number(String(val)?.slice(-1)) + 4;
      return dispatch('remoteState', {...remoteState, timer: val});
    } else if (type === 'on') {
      // 장비 시작
      return;
    } else if (type === 'off') {
      // 장비 정지
      return;
    }

    return () => {
      console.log('response out');
    };
  };

  useEffect(response, [data]);

  return setData;
}
