import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {
  Text,
  View,
  Alert,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import ScanList from './ScanList';
import {stringToBytes} from '../../../functions';
import type {Device, ConnectedInfo} from '../../../types';
import Container from '../../../components/Container';
import Button from '../../../components/Button';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function 디바이스_설정() {
  const scanList = useRef<Device[]>([]);
  const [state, setState] = useState<boolean>(true);
  const [list, setList] = useState<Device[]>([]);
  const [isScan, setIsScan] = useState<boolean>(false);
  const [connectedInfo, setConnectedInfo] = useState<ConnectedInfo>(null);

  // 블루투스 권한 요청
  const bluetoothOnRequest = (callback: () => void) => {
    BleManager.enableBluetooth().finally(() => callback());
  };

  // 시작하기
  const init = () => {
    console.log('Init!');

    isEnabled();
    let interval: NodeJS.Timer = setInterval(isEnabled, 2000);

    bluetoothOnRequest(() => BleManager.start({showAlert: false}));

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (data: Device) => {
        let find = scanList.current.find(x => x?.id === data.id);
        if (!find) {
          scanList.current.push(data);
        }
      },
    );
    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      setIsScan(false);
      scanListClean();
    });

    return () => {
      clearInterval(interval);
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    };
  };

  const listCount = useMemo(() => list?.length ?? 0, [list]);

  // 블루투스 켜기
  const bluetoothOn = () => BluetoothSerial.enable().then(setState);
  // 블루투스 끄기
  const bluetoothOff = () => BluetoothSerial.disable().then(setState);
  // 블루투스 켜짐/꺼짐 확인
  const isEnabled = () => BluetoothSerial.isEnabled().then(setState);

  // 스캔 리스트 정리
  const scanListClean = () => {
    const notDuplicateId: string[] = [
      ...new Set(scanList.current?.map(x => x.id)),
    ];
    let result: Device[] = [];

    notDuplicateId.forEach(id => {
      let find = scanList.current.find(x => x?.id === id);
      if (find) {
        result.push(find);
      }
    });
    setList(result);
  };

  // 스캔 시작
  const startScan = useCallback(() => {
    scanList.current = [];
    if (!state) {
      return bluetoothOnRequest(() => {
        Alert.alert('블루투스를 켰습니다.\n스캔을 다시 눌러주세요.');
      });
    }

    BleManager.scan([], 3, true).then(() => setIsScan(true));

    BleManager.getDiscoveredPeripherals()
      .then(() => console.log('스캔 시작'))
      .catch(() => console.log('스캔 실패'));
  }, [state]);

  // 연결 확인 & 연결 기기 서비스 및 특성 검색
  const connectedCheck = () => {
    if (!connectedInfo) {
      return Alert.alert('장비가 연결되어있지 않습니다.');
    }

    BleManager.isPeripheralConnected(connectedInfo.id, []).then(isConnected => {
      if (isConnected) {
        Alert.alert('장비가 연결되어있습니다.');
        BleManager.retrieveServices(connectedInfo.id).then(info => {
          console.log('Peripheral info:', info);
        });
      } else {
        Alert.alert('장비가 연결되어있지 않습니다.');
      }
    });
  };

  const write = () => {
    if (!connectedInfo) {
      return Alert.alert('장비가 연결되어있지 않습니다.');
    }

    let data = 'hello BLE';

    BleManager.writeWithoutResponse(
      connectedInfo.id,
      '89d3502b-0f36-433a-8ef4-c502ad55f8dc',
      'c6b2f38c-23ab-46d8-a6ab-a3a870bbd5d7',
      stringToBytes(data),
    )
      .then(() => console.log('성공', data))
      .catch(err => console.log('실패', err));
  };

  useEffect(init, []);

  return (
    <Container.View>
      <Title>React Native Bluetooth Test</Title>
      <SubTitle>블루투스: {state ? 'ON' : 'OFF'}</SubTitle>
      <Button onPress={bluetoothOn}>ON</Button>
      <Button onPress={bluetoothOff}>OFF</Button>
      <Button disabled={isScan} none={isScan} onPress={startScan}>
        스캔{isScan ? '중' : ''}
      </Button>
      <Button onPress={connectedCheck}>연결확인</Button>
      <Button onPress={write}>데이터 전송</Button>

      {isScan ? (
        <View>
          <Text>검색중..</Text>
        </View>
      ) : (
        <>
          <Text>장치 검색 수 : {listCount}개</Text>
          <ScanList list={list} setConnectedInfo={setConnectedInfo} />
        </>
      )}
    </Container.View>
  );
}

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`;
const SubTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
`;
