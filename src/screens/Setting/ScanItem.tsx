/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable curly */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {PeripheralInfo} from 'react-native-ble-manager';
import type {
  AsyncStorageError,
  AsyncStorageResult,
  Device,
  SetState,
} from '../../types';
import store from '../../store';
// import {bluetoothConnect} from '../../../hooks/bluetoothConnect';
import AntIcon from 'react-native-vector-icons/AntDesign';
import bluetoothWrite from '../../../hooks/bluetoothWrite';

type Props = {
  data: Device;
  type: 'scan' | 'connect';
  setList?: SetState<Device[]>;
};
export default function 스캔된장비_아이템({
  data,
  type,
  setList,
}: Props): JSX.Element {
  const dispatch = store(x => x?.setState);
  const activeDevice = store(x => x?.activeDevice);
  const [connectDevice, setConnectDevice] = useState<null | PeripheralInfo>(
    null,
  );
  const serviceUUID: string = 'FE60';
  const notificationUUID: string = 'FE62';

  // 전역 State 등록
  const globalStateSave = (pushData: PeripheralInfo) => {
    AsyncStorage.getItem(
      'connectDeviceList',
      (err: AsyncStorageError, result: AsyncStorageResult) => {
        if (err && !result) return;

        let parse = JSON.parse(result as string);
        let clean = new Set(parse);
        let copy = [...clean] as Device[];
        let find = copy?.find((x: Device) => x?.id === pushData?.id);

        if (!find) {
          copy.push(pushData);
          AsyncStorage.setItem('connectDeviceList', JSON.stringify(copy));
          dispatch('connectDeviceList', copy);
        }

        if (setList) {
          setList(prev => {
            let filter = prev?.filter(x => x?.id !== data?.id);
            return filter;
          });
        }
      },
    );
  };

  // 장비 연결
  const connect = async (): Promise<boolean> => {
    if (activeDevice) {
      Alert.alert('이미 연결되어 있습니다.');
      return false;
    }

    try {
      console.log('connect 시도');
      await BleManager.connect(data?.id);
      console.log('connect 성공');

      console.log('retrieveServices 시도');
      const res = await BleManager.retrieveServices(data?.id);
      console.log('retrieveServices 성공');

      console.log('startNotification 시도');
      BleManager.startNotification(res?.id, serviceUUID, notificationUUID);
      console.log('startNotification 성공');

      if (!res?.id || !res?.name) return;

      console.log('globalStateSave 시도');
      globalStateSave(res);
      console.log('globalStateSave 성공');

      console.log('dispatch 시도');
      setConnectDevice(res);
      console.log('dispatch 성공');
      // dispatch('activeDevice', {
      //   id: data?.id,
      //   name: data?.name,
      //   battery: 0,
      //   detail: data,
      // });

      return true;
      // bluetoothWrite({type: 'battery', id: data?.id, value: [0x30]});
    } catch {
      setConnectDevice(null);
      Alert.alert('다시 시도해주세요.');
      return false;
    }

    // bluetoothConnect(data?.id).then(res => {
    //   if (!res) return Alert.alert('다시 시도해주세요.');

    //   if (!res?.id || !res?.name) return;
    //   globalStateSave(res);
    //   dispatch('activeDevice', {
    //     id: data?.id,
    //     name: data?.name,
    //     battery: 0,
    //     detail: data,
    //   });
    //   Alert.alert('연결되었습니다.');

    //   bluetoothWrite({type: 'battery', id: data?.id, value: [0x30]});
    // });
  };

  // 장비 삭제
  const deleteItem = (): void => {
    AsyncStorage.getItem(
      'connectDeviceList',
      (err: AsyncStorageError, result: AsyncStorageResult) => {
        if (err && !result) return;

        let parse = JSON.parse(result as string);
        let clean = new Set(parse);
        let copy = [...clean] as Device[];
        let filter = copy?.filter((x: Device) => x?.id !== data?.id);

        AsyncStorage.setItem('connectDeviceList', JSON.stringify(filter));
        dispatch('connectDeviceList', filter);
      },
    );
  };

  // 리스트에 출력될 이름 메모
  const title = useMemo((): string => {
    let result = data?.name ?? '';
    if (result) result += ` (${data?.id})`;
    return result;
  }, [data?.id, data?.name]);

  // 연결 시 작동
  useEffect(() => {
    if (!connectDevice) return;

    dispatch('activeDevice', {
      id: connectDevice?.id,
      name: connectDevice?.name,
      battery: 0,
      detail: connectDevice,
    });
    Alert.alert('연결되었습니다.');
  }, [connectDevice, dispatch]);

  return (
    <Container>
      <ContainerText onPress={connect}>{title}</ContainerText>
      {type === 'connect' && <DeleteBtn onPress={deleteItem} />}
    </Container>
  );
}

const Container = styled.View`
  background: #f19eb4;
  padding: 0;
  margin-bottom: 10px;
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ContainerText = styled.Text`
  color: #fff;
  flex: 1;
  padding: 12px;
  height: 46px;
`;
const DeleteBtn = styled(AntIcon).attrs(() => ({
  name: 'delete',
  size: 22,
  color: '#f0d7d7',
}))`
  flex: 1;
  max-width: 46px;
  text-align: center;
`;
