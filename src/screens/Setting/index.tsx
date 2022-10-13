import React, {useEffect, useState} from 'react';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import ScanList from './ScanList';
import {User} from '../../types';
import BluetoothSwitch from './BluetoothSwitch';
import MyDeviceList from './MyDeviceList';
import Container from '../../components/Container';
import store from '../../store';

export default function 디바이스_설정(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const isLogin = store<null | User>(x => x?.isLogin);
  const [state, setState] = useState<boolean>(false);

  useEffect((): void => {
    if (!isLogin) {
      dispatch('isModal', true);
      dispatch('loginRequired', true);
    }
  }, [dispatch, isLogin]);

  useEffect(() => {
    BluetoothSerial.isEnabled().then((bool: boolean) => setState(bool));
  }, []);

  return (
    <Container.Scroll>
      <BluetoothSwitch state={state} setState={setState} />
      <MyDeviceList />
      <ScanList state={state} setState={setState} />
    </Container.Scroll>
  );
}
