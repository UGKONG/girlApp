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
  const response = (): void => {
    if (!bluetoothDataRequest || !data || !activeDevice) return;

    let type = bluetoothDataRequest?.type;
    let isAuto = bluetoothDataRequest?.isAuto;
    let val: number | string = data?.value[0];
    val = val?.toString(16);
    console.log(
      '<- BLE 응답: ' +
        type +
        ', value: ' +
        val +
        ' (오리지날: ' +
        data?.value[0] +
        ')',
    );

    // Validate
    if (type === 'batteryV') return;
    // if (type === 'battery') return;
    if (type === 'mode' && val[0] !== '8') return;
    if (type === 'power' && val[0] !== '5') return;
    if (type === 'timer' && val[0] !== '9') return;
    if (type === 'on' && val !== '43') return;
    if (type === 'off' && val !== '41') return;

    // 연결 시 첫 배터리 요청에 대한 응답이 왔을 때..
    if (type === 'init') {
      val = Number(val?.slice(-1) + '0');
      dispatch('activeDevice', {...activeDevice, battery: val});

      return bleWrite({
        type: 'mode',
        id: activeDevice?.id,
        value: [0x70 + (remoteState?.mode ?? 1)],
        isAuto: true,
      });
    }

    // 배터리에 대한 응답이 왔을 때..
    if (type === 'battery') {
      let battery: number = Number(String(val)?.slice(1) + '0');
      return dispatch('activeDevice', {...activeDevice, battery: battery});
    }

    // 모드에 대한 응답이 왔을 때..
    if (type === 'mode') {
      val = Number(String(val)?.slice(-1));
      dispatch('remoteState', {...remoteState, mode: val});

      if (isAuto) {
        bleWrite({
          type: 'power',
          id: activeDevice?.id,
          value: [0x50 + (remoteState?.power ?? 2)],
          isAuto: true,
        });
      }
      return;
    }

    // 에너지에 대한 응답이 왔을 때..
    if (type === 'power') {
      val = Number(String(val)?.slice(-1));
      dispatch('remoteState', {...remoteState, power: val});

      if (isAuto) {
        bleWrite({
          type: 'timer',
          id: activeDevice?.id,
          value: [0x80 + (remoteState?.timer ?? 7)],
          isAuto: true,
        });
      }
      return;
    }

    // 타이머에 대한 응답이 왔을 때..
    if (type === 'timer') {
      val = Number(String(val)?.slice(-1));
      return dispatch('remoteState', {...remoteState, timer: val});
    }

    // 장비 시작
    if (type === 'on') {
      return;
    }

    // 장비 정지
    if (type === 'off') {
      return;
    }
  };

  useEffect(response, [data]);

  return setData;
}
