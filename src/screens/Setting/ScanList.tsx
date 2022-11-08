/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
import React, {useEffect, useMemo, useState} from 'react';
import {NativeModules, NativeEventEmitter, Alert} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import {
  Container,
  Header,
  Title,
  List as _List,
  DescriptionText,
} from './MyDeviceList';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import DeviceItem from './DeviceItem';
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
  const possibleDeviceName = store(x => x?.possibleDeviceName);
  const myDeviceList = store(x => x?.myDeviceList);
  const LANG = store(x => x?.lang);
  const [isScan, setIsScan] = useState<boolean>(false);
  const [list, setList] = useState<Device[]>([]);

  // 블루투스 켜기
  const bluetoothOn = async (): Promise<void> => {
    try {
      const bool = await BluetoothSerial.enable();
      setState(bool);
    } catch {
      setState(false);
    }
  };

  // 검색 시작
  const startScan = async (): Promise<void> => {
    request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)
      .then(() => {
        if (!state) {
          return Alert.alert(
            'LUNA',
            LANG === 'ko'
              ? '블루투스가 꺼져있습니다. 블루투스를 켜시겠습니까?'
              : 'Bluetooth is off. Turn on Bluetooth?',
            [
              {text: LANG === 'ko' ? '취소' : 'Cancel'},
              {text: LANG === 'ko' ? '켜기' : 'Turn on', onPress: bluetoothOn},
            ],
            {cancelable: true},
          );
        }
        setIsScan(true);
        setList([]);

        BleManager.scan([], 5, false)
          .then(() => {
            BleManager.getDiscoveredPeripherals()
              .then(() => {})
              .catch(() => {});
          })
          .catch(() => {});
      })
      .catch(() => {
        setIsScan(false);
        Alert.alert(
          'LUNA',
          LANG === 'ko'
            ? '검색에 실패하였습니다. 다시 시도해주세요.'
            : 'Search failed. Please try again.',
        );
      });
  };

  const scanning = (data: Device): void => {
    // 데이터에 아이디와 이름이 있는지 확인
    if (!data?.id || !data?.name) return;
    // console.log('스캔:', {id: data?.id, name: data?.name});
    // 장비 이름에 LUNA가 들어가는지 확인
    if (data?.name?.indexOf(possibleDeviceName) === -1) return;
    // 스캔 리스트에 이미 있는 데이터는 중복 안됨
    if (list.find(x => x?.id === data?.id)) return;
    // 내장비로 등록된 장비는 스캔 리스트에 안나옴
    if (myDeviceList?.find(x => x?.id === data?.id)) return;

    setList(prev => [...prev, data]);
  };

  const stopScan = (): void => {
    setIsScan(false);
  };

  // 스캔중 텍스트
  const scanCountText = useMemo<string>(() => {
    return (list?.length ?? 0) + (LANG === 'ko' ? '개' : ' thing');
  }, [list]);

  // 스캔중 색상
  const scanColor = useMemo<string>(() => {
    return isScan ? '#ccc' : '#999';
  }, [isScan]);

  // 스캔 관련 이벤트 리스너
  useEffect((): (() => void) => {
    bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', scanning);
    bleManagerEmitter.addListener('BleManagerStopScan', stopScan);
    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    };
  }, [scanning]);

  // 블루투스 켤때 자동 스캔 시작
  useEffect(() => {
    if (!state) setIsScan(false);
  }, [state]);

  // 초기화
  useEffect(() => {
    setIsScan(false);
    setList([]);
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          {LANG === 'ko' ? '검색 장비' : 'Search Device'} ({scanCountText})
        </Title>
        <SearchBtn disabled={isScan} onPress={startScan}>
          <SearchIcon color={scanColor} />
          <SearchText style={{color: scanColor}}>
            {LANG === 'ko'
              ? '검색' + (isScan ? '중' : '')
              : 'Scan' + (isScan ? 'ning' : '')}
          </SearchText>
        </SearchBtn>
      </Header>
      <List>
        {list?.length === 0 ? (
          <DescriptionText>
            {LANG === 'ko'
              ? '검색된 주변 장비가 없습니다.'
              : 'No device detected.'}
          </DescriptionText>
        ) : (
          list?.map(item => (
            <DeviceItem
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
