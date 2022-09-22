/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Dispatch, SetStateAction, useMemo} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import type {ConnectedDevice, Device} from '../../types';

type Props = {
  data: Device;
  connectedDevice: ConnectedDevice;
  setConnectedDevice: Dispatch<SetStateAction<ConnectedDevice>>;
};
export default function 스캔된장비_아이템({
  data,
  connectedDevice,
  setConnectedDevice,
}: Props) {
  const onClick = () => {
    BleManager.connect(data?.id)
      .then(() => {
        console.log(data);
        setConnectedDevice({id: data?.id, detail: null});
        Alert.alert('연결되었습니다.');
      })
      .catch(() => {
        setConnectedDevice(null);
        Alert.alert('연결에 실패하였습니다.');
      });
  };

  // 연결 확인 & 연결 기기 서비스 및 특성 검색
  const connectedCheck = () => {
    if (!connectedDevice) {
      return Alert.alert('장비가 연결되어있지 않습니다.');
    }

    BleManager.isPeripheralConnected(connectedDevice?.id, []).then(
      isConnected => {
        if (isConnected) {
          Alert.alert('장비가 연결되어있습니다.');
          BleManager.retrieveServices(connectedDevice?.id).then(info => {
            console.log('Peripheral info:', info);
          });
        } else {
          Alert.alert('장비가 연결되어있지 않습니다.');
        }
      },
    );
  };

  const title = useMemo(() => {
    let result = data?.id;
    if (data?.name) {
      result += ` (${data?.name})`;
    }
    return result;
  }, [data?.id, data?.name]);

  return (
    <Container onPress={onClick}>
      <ContainerText>{title}</ContainerText>
    </Container>
  );
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  background: #f19eb4;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
`;
const ContainerText = styled.Text`
  color: #fff;
`;
