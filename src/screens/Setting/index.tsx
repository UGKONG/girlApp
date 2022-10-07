import React, {useEffect, useState} from 'react';
import ScanList from './ScanList';
import {User} from '../../types';
import BluetoothSwitch from './BluetoothSwitch';
import ConnectedList from './ConnectedList';
import Container from '../../components/Container';
import store from '../../store';
import useBluetoothInit from '../../../hooks/useBluetoothInit';

export default function 디바이스_설정(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const isLogin = store<null | User>(x => x?.isLogin);
  const [state, setState] = useState<boolean>(true);
  useBluetoothInit();

  useEffect((): void => {
    if (!isLogin) {
      dispatch('isModal', true);
      dispatch('loginRequired', true);
    }
  }, [dispatch, isLogin]);

  return (
    <Container.Scroll>
      <BluetoothSwitch state={state} setState={setState} />
      <ConnectedList />
      <ScanList state={state} setState={setState} />
    </Container.Scroll>
  );
}
