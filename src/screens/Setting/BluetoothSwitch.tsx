import React, {useCallback, useEffect} from 'react';
import {Switch} from 'react-native';
import styled from 'styled-components/native';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import type {SetState} from '../../types';

type Props = {
  state: boolean;
  setState: SetState<boolean>;
};
export default function 블루투스_스위치({state, setState}: Props): JSX.Element {
  // 블루투스 켜기
  const bluetoothOn = useCallback((): void => {
    setState(true);
    BluetoothSerial.enable().then(() => setState(true));
  }, [setState]);

  // 블루투스 끄기
  const bluetoothOff = useCallback((): void => {
    setState(false);
    BluetoothSerial.disable().then(() => setState(false));
  }, [setState]);

  // 블루투스 켜짐/꺼짐 확인
  const isEnabled = useCallback((): void => {
    BluetoothSerial.isEnabled().then(setState);
  }, [setState]);

  const change = (): void => {
    (state ? bluetoothOff : bluetoothOn)();
  };

  useEffect((): (() => void) => {
    isEnabled();
    return (): void => isEnabled();
  }, [isEnabled]);

  return (
    <Container>
      <Label>블루투스</Label>
      <Switch
        trackColor={{false: '#cacaca', true: '#E87EA6'}}
        thumbColor={state ? '#E87EA6' : '#cacaca'}
        ios_backgroundColor="#cacaca"
        onValueChange={change}
        value={state}
      />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  background-color: #fce9f1;
  border: 2px solid #fedeec;
  border-radius: 10px;
  margin-bottom: 20px;
`;
const Label = styled.Text`
  font-size: 15px;
  font-weight: 700;
  text-align: center;
`;
