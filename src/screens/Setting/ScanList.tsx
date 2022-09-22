/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Alert, NativeModules, NativeEventEmitter} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import {Container, Header, Title, List as _List} from './ConnectedList';
import {Device, ConnectedDevice} from '../../types';
import ScanItem from './ScanItem';
import {store} from '../../functions';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

type Props = {
  state: boolean;
  connectedDevice: ConnectedDevice;
  setConnectedDevice: Dispatch<SetStateAction<ConnectedDevice>>;
};
export default function 검색된장비_리스트({
  state,
  connectedDevice,
  setConnectedDevice,
}: Props) {
  const possibleDeviceList = store<string[]>(x => x?.possibleDeviceList);
  const scanList = useRef<Device[]>([]);
  const [isScan, setIsScan] = useState<boolean>(false);
  const [list, setList] = useState<Device[]>([]);

  // 검색 시작
  const startScan = useCallback((): void => {
    if (!state) return Alert.alert('블루투스를 켜주세요.');
    scanList.current = [];
    setList([]);

    BleManager.scan([], 5, true).then(() => {
      setIsScan(true);
      BleManager.getDiscoveredPeripherals();
    });
  }, [state]);

  // 검색 리스트 정리
  const scanListClean = useCallback((): void => {
    const cleanList: Device[] = [...new Set(scanList.current)];
    let result: Device[] = [];
    console.log(
      'original-list',
      cleanList?.map(x => x?.name),
    );
    possibleDeviceList.forEach(name => {
      let find = cleanList?.find(x => x?.name === name);
      if (find) result.push(find);
    });
    setList(result);
  }, [possibleDeviceList]);

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

  useEffect(() => {
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', scanning);
    bleManagerEmitter.addListener('BleManagerStopScan', stopScan);
    startScan();
    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    };
  }, [startScan, stopScan]);

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
              key={item?.id}
              data={item}
              connectedDevice={connectedDevice}
              setConnectedDevice={setConnectedDevice}
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
