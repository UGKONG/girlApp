/* eslint-disable no-shadow */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
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
  // 장비 클릭
  const onClick = () => {
    BleManager.connect(data?.id)
      .then(() => {
        console.log(data);
        setConnectedDevice(data ?? null);
        // sendData();
      })
      .catch(() => {
        setConnectedDevice(null);
        Alert.alert('연결에 실패하였습니다.');
      });
  };

  // 데이터 수신
  const getData = useCallback(() => {
    if (!connectedDevice) return console.log('connectedDevice is null!!');

    BleManager.startNotification(connectedDevice?.id, 'fe60', 'FE62')
      .then(data => {
        console.log('Notification started', data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [connectedDevice]);

  // 데이터 송신
  const sendData = useCallback(() => {
    if (!connectedDevice) return console.log('connectedDevice is null!!');
    const data = 0x40;

    BleManager.write(connectedDevice?.id, 'fe60', 'FE61', data)
      .then(() => {
        console.log('send success');
        getData();
      })
      .catch(err => {
        console.log(err);
      });
  }, [connectedDevice, getData]);

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
    let result = data?.name;
    if (result) result += ` (${data?.id})`;
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
