/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NativeModules, NativeEventEmitter} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import {Container, Header, Title, List as _List} from './ConnectedList';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import ScanItem from './ScanItem';
import store from '../../store';
import type {Device, SetState} from '../../types';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

type Props = {
  state: boolean;
  setState: SetState<boolean>;
};
export default function 검색된장비_리스트({
  state,
  setState,
}: Props): JSX.Element {
  const possibleDeviceName = store<string>(x => x?.possibleDeviceName);
  const connectDeviceList = store<Device[]>(x => x?.connectDeviceList);
  const scanList = useRef<Device[]>([]);
  const [isScan, setIsScan] = useState<boolean>(false);
  const [list, setList] = useState<Device[]>([]);

  // 블루투스 켜기
  const bluetoothOn = useCallback(
    (callback: () => void): void => {
      setState(true);
      BluetoothSerial.enable().then(() => {
        setState(true);
        callback();
      });
    },
    [setState],
  );

  // 검색 시작
  const startScan = useCallback((): void => {
    if (!state) {
      bluetoothOn(startScan);
      return;
    }

    scanList.current = [];
    setList([]);

    BleManager.scan([], 5, true).then(() => {
      setIsScan(true);
      BleManager.getDiscoveredPeripherals();
    });
  }, [bluetoothOn, state]);

  // 검색 리스트 정리
  const scanListClean = useCallback((): void => {
    const cleanList: Device[] = [...new Set(scanList.current)];
    let result: Device[] = [];

    console.log(
      '검색된 전체 리스트',
      cleanList?.map(x => x?.name),
    );

    cleanList?.forEach(item => {
      let name: string = item?.name as string;
      let validate1 = name?.indexOf(possibleDeviceName) > -1;
      let validate2 = connectDeviceList?.find(x => x?.id === item?.id);

      if (validate1 && !validate2) result.push(item);
    });

    setList(result);
  }, [possibleDeviceName]);

  const scanning = (data: Device): void => {
    let find: Device | undefined = scanList.current.find(
      x => x?.id === data.id,
    );
    if (!find && data?.name) scanList.current.push(data);
  };

  const stopScan = useCallback((): void => {
    setIsScan(false);
    scanListClean();
  }, [scanListClean]);

  useEffect((): (() => void) => {
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', scanning);
    bleManagerEmitter.addListener('BleManagerStopScan', stopScan);
    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    };
  }, []);

  return (
    <Container>
      <Header>
        <Title>검색 장비 ({list?.length ?? 0}개)</Title>
        <SearchBtn disabled={isScan} onPress={startScan}>
          <SearchIcon color={isScan ? '#ccc' : '#999'} />
          <SearchText style={{color: isScan ? '#ccc' : '#999'}}>
            검색{isScan ? '중' : ''}
          </SearchText>
        </SearchBtn>
      </Header>
      <List>
        {isScan ? (
          <DescriptionText>주변 장비를 검색중입니다.</DescriptionText>
        ) : list?.length === 0 ? (
          <DescriptionText>검색된 주변 장비가 없습니다.</DescriptionText>
        ) : (
          list?.map(item => (
            <ScanItem
              type="scan"
              key={item?.id}
              data={item}
              setList={setList}
            />
          ))
        )}
      </List>
    </Container>
  );
}

const DescriptionText = styled.Text`
  text-align: center;
  padding: 20px 0;
  color: #dc9fc5aa;
`;
const SearchBtn = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
  align-self: stretch;
`;
const SearchIcon = styled(Ionicons).attrs(() => ({
  name: 'search',
  size: 18,
}))``;
const SearchText = styled.Text`
  margin-left: 7px;
`;
const List = styled(_List)`
  min-height: 250px;
  margin-bottom: 10px;
`;
