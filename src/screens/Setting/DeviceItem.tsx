/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */

import React, {useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import Prompt from 'react-native-prompt-android';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Device, MyDevice, SetState} from '../../types';
import store from '../../store';
import EntIcon from 'react-native-vector-icons/Entypo';
import useBluetoothWrite from '../../../hooks/useBluetoothWrite';

type Props = {
  data: Device | MyDevice;
  type: 'scan' | 'my' | 'connect';
  setList?: SetState<Device[]>;
};
export default function 스캔된장비_아이템({
  data,
  type,
  setList,
}: Props): JSX.Element {
  const bleWrite = useBluetoothWrite();
  const dispatch = store(x => x?.setState);
  const activeDevice = store(x => x?.activeDevice);
  const myDeviceList = store(x => x?.myDeviceList);
  const LANG = store(x => x?.lang);
  const serviceUUID: string = 'FE60';
  const notificationUUID: string = 'FE62';
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // 장비 초기화
  const connectDeviceReset = () => {
    dispatch('activeDevice', null);
    dispatch('bluetoothDataRequest', null);
    dispatch('remoteState', null);
  };

  // 내장비 등록
  const addMyDevice = async (value: string) => {
    const saveData: MyDevice = {
      id: data?.id,
      name: value || data?.name || 'MY LUNA DEVICE',
    };

    dispatch('myDeviceList', [...myDeviceList, saveData]);
    const local = await AsyncStorage.getItem('myDeviceList');
    const localParse = JSON.parse(local || '[]');
    await AsyncStorage.setItem(
      'myDeviceList',
      JSON.stringify([...localParse, saveData]),
    );

    if (setList) setList(prev => prev?.filter(x => x?.id !== data?.id));
  };

  // 장비 연결
  const connect = async (): Promise<void> => {
    setIsConnecting(true);
    try {
      await BleManager.connect(data?.id);
      await BleManager.retrieveServices(data?.id);
      await BleManager.startNotification(
        data?.id,
        serviceUUID,
        notificationUUID,
      );
    } catch {
      setIsConnecting(false);
      let failText =
        LANG === 'ko'
          ? '연결에 실패하였습니다. 루나를 3초간 만져주세요'
          : 'Connection failed. Touch LUNA for 3 seconds';
      return Alert.alert('LUNA', failText, undefined, {cancelable: true});
    }
    setIsConnecting(false);

    dispatch('activeDevice', {
      id: data?.id,
      name: data?.name,
      battery: 0,
      detail: data,
      isOn: false,
    });
    bleWrite({type: 'init', value: [0x30]});
    let successText =
      LANG === 'ko' ? '장비가 연결되었습니다.' : 'Connected Device.';
    return Alert.alert('LUNA', successText, undefined, {cancelable: true});
  };

  // 장비 연결 해제
  const disconnect = async (): Promise<void> => {
    await BleManager.disconnect(data?.id);
    connectDeviceReset();
  };

  // 장비 삭제
  const remove = async (): Promise<void> => {
    const local = await AsyncStorage.getItem('myDeviceList');

    let parse = JSON.parse(local || '[]');
    let filter = parse?.filter((x: MyDevice) => x?.id !== data?.id);

    disconnect();
    dispatch('myDeviceList', filter);
    await AsyncStorage.setItem('myDeviceList', JSON.stringify(filter));
    Alert.alert(
      'LUNA',
      LANG === 'ko' ? '내장비가 제거되었습니다.' : 'Deleted my device.',
      undefined,
      {
        cancelable: true,
      },
    );
  };

  // 내장비 등록 옵션
  const addMyDeviceOption = (): void => {
    Prompt(
      'LUNA',
      LANG === 'ko' ? '내장비의 이름을 입력해주세요.' : 'Please enter a name',
      [
        {text: LANG === 'ko' ? '취소' : 'Cancel'},
        {text: LANG === 'ko' ? '확인' : 'Yes', onPress: addMyDevice},
      ],
      {
        cancelable: true,
        placeholder: 'MY LUNA DEVICE',
        defaultValue: 'MY LUNA DEVICE',
      },
    );
  };

  // 장비 연결 옵션
  const connectOption = (): void => {
    if (isConnect) return disconnectOption();

    Alert.alert(
      'LUNA',
      LANG === 'ko'
        ? '해당 장비를 연결 하시겠습니까?'
        : 'Do you want to connect?',
      [
        {
          text: LANG === 'ko' ? '내장비 등록' : 'Add my device',
          onPress: addMyDeviceOption,
        },
        {text: LANG === 'ko' ? '취소' : 'Calcel'},
        {text: LANG === 'ko' ? '연결' : 'Connection', onPress: connect},
      ],
      {cancelable: true},
    );
  };

  // 장비 연결 해제 옵션
  const disconnectOption = (): void => {
    Alert.alert(
      'LUNA',
      LANG === 'ko'
        ? '현재 연결된 장비입니다. 연결을 해제하시겠습니까?'
        : 'Do you want to disconnect?',
      [
        {text: LANG === 'ko' ? '아니요' : 'No'},
        {text: LANG === 'ko' ? '예' : 'Yes', onPress: disconnect},
      ],
      {cancelable: true},
    );
  };

  // 장비 삭제 옵션
  const removeOption = (): void => {
    const title = isConnect
      ? LANG === 'ko'
        ? '연결을 해제하시겠습니까?'
        : 'Do you want to disconnect?'
      : LANG === 'ko'
      ? '해당 장비를 연결 하시겠습니까?'
      : 'Do you want to connect?';
    const btnName = isConnect
      ? LANG === 'ko'
        ? '연결 해제'
        : 'Disconnect'
      : LANG === 'ko'
      ? '연결'
      : 'Connect';
    const btnCallback = isConnect ? disconnect : connect;

    Alert.alert(
      'LUNA',
      title,
      [
        {text: LANG === 'ko' ? '내장비 제거' : 'Delete', onPress: remove},
        {text: LANG === 'ko' ? '취소' : 'Cancel'},
        {text: btnName, onPress: btnCallback},
      ],
      {
        cancelable: true,
      },
    );
  };

  useEffect((): void => setIsConnecting(false), []);

  // 리스트에 출력될 이름 메모
  const title = useMemo<string>(() => {
    let result = data?.name ?? 'LUNA';
    if (result && type !== 'my') result += ` (${data?.id})`;
    return result;
  }, [data?.id, data?.name]);

  // 이미 연결된 장비
  const isConnect = useMemo<boolean>(() => {
    return activeDevice?.id === data?.id;
  }, [activeDevice?.id, data?.id]);

  // 클릭 시 함수
  const clickFn = isConnecting
    ? () => {}
    : type === 'my'
    ? removeOption
    : connectOption;

  return (
    <Container type={type} onPress={clickFn}>
      <ContainerText>{title}</ContainerText>
      {type !== 'connect' && isConnect && (
        <Option>
          <Icon name="link" />
          <Status>{LANG === 'ko' ? '연결중' : 'Connect'}</Status>
        </Option>
      )}

      {isConnecting && (
        <Connecting>
          <ConnectingText>
            {LANG === 'ko' ? '연결 시도중' : 'Connection'}
          </ConnectingText>
        </Connecting>
      )}
    </Container>
  );
}

type ContainerProps = {type: string};
const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  background: ${(x: ContainerProps) =>
    x?.type === 'connect' ? '#e27894' : '#f19eb4'};
  padding: 0;
  margin-bottom: 10px;
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
`;
const ContainerText = styled.Text`
  color: #fff;
  flex: 1;
  padding: 12px;
  height: 46px;
`;
const Option = styled.View`
  flex: 1;
  max-width: 80px;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 12px;
`;
const Icon = styled(EntIcon).attrs(() => ({
  size: 20,
  color: '#ffff00',
}))`
  margin-right: 5px;
`;
const Status = styled.Text`
  font-size: 13px;
  color: #ffff00;
`;
const Connecting = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: #44444488;
`;
const ConnectingText = styled.Text`
  color: #ffff00;
  font-weight: 700;
  letter-spacing: 1px;
`;
