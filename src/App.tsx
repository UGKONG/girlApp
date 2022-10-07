/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
import React, {useEffect} from 'react';
import {
  Platform,
  StatusBar,
  BackHandler,
  Alert,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {request, PERMISSIONS} from 'react-native-permissions';
import store from './store';
import MyNavigator from './navigator';
import SideMenu from './components/SideMenu';
import LoginModal from './components/LoginModal';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageError, AsyncStorageResult} from './types';
import bluetoothInit from '../hooks/bluetoothInit';
import bluetoothWrite from '../hooks/bluetoothWrite';
import bluetoothDataResponse from '../hooks/bluetoothDataResponse';

const os = Platform.OS;
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function App(): JSX.Element {
  const bleInit = bluetoothInit();
  const bleWrite = bluetoothWrite();
  const bleResponse = bluetoothDataResponse();
  const navigationRef = useNavigationContainerRef();
  const dispatch = store(x => x?.setState);
  const activeDevice = store(x => x?.activeDevice);
  const isBluetoothReady = store(x => x?.isBluetoothReady);
  const isModal = store<boolean>(x => x?.isModal);
  useEffect(bleInit, []);
  // 안드로이드 위치 권한 요청
  const androidLocationRequest = (fn: any): void => {
    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(x => {
      if (x === 'denied') fn();
    });
  };

  // IOS 위치 권한 요청
  const iosLocationRequest = (fn: any): void => {
    request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(x => {
      if (x === 'denied') fn();
    });
  };

  // 자동 로그인 체크
  const autoLoginCheck = () => {
    AsyncStorage.getItem(
      'isLogin',
      (err: AsyncStorageError, result: AsyncStorageResult): void => {
        if (err || !result) return;
        dispatch('isLogin', JSON.parse(result as string));
      },
    );
  };

  // 연결된 디바이스 리스트 확인
  const getConnectedDeviceList = () => {
    AsyncStorage.getItem(
      'connectDeviceList',
      (err: AsyncStorageError, result: AsyncStorageResult) => {
        if (err || !result) AsyncStorage.setItem('connectDeviceList', '[]');
        dispatch('connectDeviceList', JSON.parse(result as string));
      },
    );
  };

  // 권한 요청
  useEffect((): void => {
    if (os === 'android') androidLocationRequest(androidLocationRequest);
    if (os === 'ios') iosLocationRequest(iosLocationRequest);
  }, []);

  // 블루투스 Init
  // useEffect(() => {
  //   bleInit();
  // }, []);

  // 안드로이드 뒤로가기 버튼 클릭
  useEffect((): (() => void) => {
    const backBtnClick = (): boolean => {
      const rootState = navigationRef?.getRootState();
      const name = rootState?.routes[rootState?.routes?.length - 1]?.name;

      if (name === 'home') {
        Alert.alert('NUNA', '앱을 종료하시겠습니까?', [
          {text: '확인', onPress: () => BackHandler.exitApp()},
          {text: '취소', onPress: () => null},
        ]);
        return true;
      } else {
        return false;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', backBtnClick);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backBtnClick);
    };
  }, [navigationRef]);

  // 자동로그인체크
  useEffect(autoLoginCheck, [dispatch]);

  // 연결된 디바이스 리스트 확인
  useEffect(getConnectedDeviceList, [dispatch]);

  // Response 이벤트 등록
  useEffect(() => {
    bleManagerEmitter.removeAllListeners(
      'BleManagerDidUpdateValueForCharacteristic',
    );
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      bleResponse,
    );
    console.log('-------- App Loaded --------', new Date());

    return () => {
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );
    };
  }, []);

  //
  useEffect(() => {
    if (!activeDevice || !isBluetoothReady) return;

    bleWrite({
      type: 'battery',
      id: activeDevice?.id,
      value: [0x30],
    });
    // let interval = setInterval(() => {
    //   bleWrite({
    //     type: 'battery',
    //     id: activeDevice?.id,
    //     value: [0x30],
    //   });
    // }, 10000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" />

      {/* Screen Navigation */}
      <MyNavigator />

      {/* Login Modal */}
      <LoginModal isModal={isModal} />

      {/* Side Navigation Bar */}
      <SideMenu navigationRef={navigationRef} />

      {/* Custom Alert */}
      <Toast />
    </NavigationContainer>
  );
}
