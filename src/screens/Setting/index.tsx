/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import ScanList from './ScanList';
import {ConnectedDevice, User} from '../../types';
import BluetoothSwitch from './BluetoothSwitch';
import ConnectedList from './ConnectedList';
import Container from '../../components/Container';
import store from '../../store';
import {Button} from 'react-native';

export default function 디바이스_설정(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const isLogin = store<null | User>(x => x?.isLogin);
  const [state, setState] = useState<boolean>(true);
  const [connectedDevice, setConnectedDevice] = useState<ConnectedDevice>(null);

  // 시작하기
  const init = (): void => {
    BleManager.enableBluetooth()
      .then(() => setState(true))
      .catch(() => setState(false))
      .finally(() => BleManager.start({showAlert: false}));
  };

  useEffect((): void => {
    if (!isLogin) {
      dispatch('isModal', true);
      dispatch('loginRequired', true);
    }
  }, [dispatch, isLogin]);

  useEffect((): void => {
    init();
  }, []);

  return (
    <Container.Scroll>
      <BluetoothSwitch state={state} setState={setState} />
      <ConnectedList />
      <ScanList
        state={state}
        setState={setState}
        setConnectedDevice={setConnectedDevice}
      />
    </Container.Scroll>
  );
}
