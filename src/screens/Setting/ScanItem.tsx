/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-shadow */
/* eslint-disable curly */

import React, {useCallback, useMemo} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import {useStringToBytes} from '../../functions';
import type {
  ConnectedDevice,
  Device,
  SetState,
  SendDataInfo,
} from '../../types';
import store from '../../store';

type Props = {
  data: Device;
  setConnectedDevice: SetState<ConnectedDevice>;
};
export default function 스캔된장비_아이템({
  data,
  setConnectedDevice,
}: Props): JSX.Element {
  const dispatch = store(x => x?.setState);

  // 장비 클릭
  const onClick = (): void => {
    BleManager.connect(data?.id)
      .then(() => {
        setConnectedDevice(data ?? null);
        sendValidate(data);
        getData({
          id: data?.id,
          serviceUUID: 'FE60',
          characteristicUUID: 'FE61',
        });
      })
      .catch((err: Error) => {
        setConnectedDevice(null);
        Alert.alert('연결에 실패하였습니다.');
        console.log(err);
      });
  };

  // 데이터 수신
  const getData = useCallback((data: SendDataInfo): void => {
    BleManager.retrieveServices(data?.id).finally(() => {
      console.log('Notification 시도');
      BleManager.startNotification(
        data?.id,
        data?.serviceUUID,
        data?.characteristicUUID,
      )
        .then(() => {
          console.log('Notification 성공 ->');
        })
        .catch(err => {
          console.log('Notification 실패 ->', err);
        });
    });
  }, []);

  // 데이터 송신
  const sendData = useCallback((data: SendDataInfo) => {
    let tryCount: number = 0;

    const write = (thisFn?: any) => {
      console.log('Write 시도');
      tryCount += 1;
      BleManager.writeWithoutResponse(
        data?.id,
        data?.serviceUUID,
        data?.characteristicUUID,
        data?.value,
      )
        .then(() => {
          console.log('Write 성공');
          // getData(data);
        })
        .catch(err => {
          console.log('Write 실패', err);
          if (tryCount < 2) {
            console.log('Write 재시도');
            thisFn();
          }
        });
    };

    BleManager.retrieveServices(data?.id).finally(() => write(write));
  }, []);

  // 데이터 송신 전 Validate
  const sendValidate = useCallback(
    (deviceInfo: Device): void => {
      // validation
      if (!deviceInfo) {
        console.log('deviceInfo is null!!');
        return;
      }
      if (!deviceInfo?.advertising?.serviceUUIDs?.length) {
        console.log('ServiceUUIDs 배열이 비었습니다.');
        return;
      }

      // 선택한 디바이스 정보 & 전송 정보
      let id = deviceInfo?.id;
      let serviceUUID: string = 'FE60';
      let characteristicUUID: string = 'FE61';
      let value: number[] = useStringToBytes('0x40');

      // Write
      sendData({id, serviceUUID, characteristicUUID, value});
    },
    [sendData],
  );

  const title = useMemo((): string => {
    let result = data?.name ?? '';
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
