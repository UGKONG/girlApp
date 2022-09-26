import React, {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import ScanList from './ScanList';
import type {ConnectedDevice} from '../../types';
import BluetoothSwitch from './BluetoothSwitch';
import ConnectedList from './ConnectedList';
import Container from '../../components/Container';

export default function 디바이스_설정(): JSX.Element {
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
    init();
  }, []);

  return (
    <Container.Scroll>
      <BluetoothSwitch state={state} setState={setState} />
      <ConnectedList />
      <ScanList
        state={state}
        setState={setState}
        connectedDevice={connectedDevice}
        setConnectedDevice={setConnectedDevice}
      />
    </Container.Scroll>
  );
}
