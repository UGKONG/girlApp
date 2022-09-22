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

  // 연결 확인 & 연결 기기 서비스 및 특성 검색
  const connectedCheck = () => {
    if (!connectedDevice) {
      return Alert.alert('장비가 연결되어있지 않습니다.');
    }

    BleManager.isPeripheralConnected(connectedDevice.id, []).then(
      isConnected => {
        if (isConnected) {
          Alert.alert('장비가 연결되어있습니다.');
          BleManager.retrieveServices(connectedDevice.id).then(info => {
            console.log('Peripheral info:', info);
          });
        } else {
          Alert.alert('장비가 연결되어있지 않습니다.');
        }
      },
    );
  };

  const write = () => {
    if (!connectedDevice) {
      return Alert.alert('장비가 연결되어있지 않습니다.');
    }

    let data = 'hello BLE';

    BleManager.writeWithoutResponse(
      connectedDevice.id,
      '89d3502b-0f36-433a-8ef4-c502ad55f8dc',
      'c6b2f38c-23ab-46d8-a6ab-a3a870bbd5d7',
      stringToBytes(data),
    )
      .then(() => console.log('성공', data))
      .catch(err => console.log('실패', err));
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

      {/* <Button onPress={connectedCheck}>연결확인</Button>
      <Button onPress={write}>데이터 전송</Button> */}
    </Container.Scroll>
  );
}
