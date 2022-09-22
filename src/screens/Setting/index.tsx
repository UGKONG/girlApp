/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import ScanList from './ScanList';
import {stringToBytes} from '../../functions';
import type {Device, ConnectedDevice} from '../../types';
import BluetoothSwitch from './BluetoothSwitch';
import ConnectedList from './ConnectedList';
import Container from '../../components/Container';
import Button from '../../components/Button';

export default function 디바이스_설정() {
  const [state, setState] = useState<boolean>(true);
  const [connectedDevice, setConnectedDevice] = useState<ConnectedDevice>(null);

  // 시작하기
  const init = () => {
    BleManager.enableBluetooth()
      .then(() => setState(true))
      .catch(() => setState(false))
      .finally(() => BleManager.start({showAlert: false}));
  };

  useEffect(init, []);

  return (
    <Container.Scroll>
      <BluetoothSwitch state={state} setState={setState} />
      <ConnectedList />
      <ScanList
        state={state}
        connectedDevice={connectedDevice}
        setConnectedDevice={setConnectedDevice}
      />
    </Container.Scroll>
  );
}
