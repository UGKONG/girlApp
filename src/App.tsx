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
  AppState,
  PermissionsAndroid,
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
import useBluetoothInit from '../hooks/useBluetoothInit';
import useBluetoothWrite from '../hooks/useBluetoothWrite';
import useBluetoothDataResponse from '../hooks/useBluetoothDataResponse';
import SplashScreen from 'react-native-splash-screen';

const os = Platform.OS;
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function App(): JSX.Element {
  const bleInit = useBluetoothInit();
  const bleWrite = useBluetoothWrite();
  const bleResponse = useBluetoothDataResponse();
  const navigationRef = useNavigationContainerRef();
  const dispatch = store(x => x?.setState);
  const activeDevice = store(x => x?.activeDevice);
  const isBluetoothReady = store(x => x?.isBluetoothReady);
  const possibleDeviceName = store(x => x?.possibleDeviceName);
  const isModal = store<boolean>(x => x?.isModal);

  // 안드로이드 위치 권한 요청
  const androidLocationRequest = (fn: any): void => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    ]).then(result => {
      if (
        result['android.permission.ACCESS_FINE_LOCATION'] &&
        result['android.permission.BLUETOOTH_SCAN'] &&
        result['android.permission.BLUETOOTH_CONNECT'] //&&
        // result['android.permission.BLUETOOTH_ADVERTISE'] === 'granted'
      ) {
        console.log('모든 권한 획득');
      } else {
        Alert.alert(
          possibleDeviceName,
          '서비스 이용에 모든 권한이 필요합니다.',
        );
        if (fn) setTimeout(() => fn(), 1000);
      }
    });

    // request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN).then(x => {
    //   if (x === 'denied') fn();
    //   console.log(x);
    // });
  };

  // IOS 위치 권한 요청
  const iosLocationRequest = (fn: any): void => {
    request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(x => {
      if (x === 'denied') fn();
    });
  };

  // 자동 로그인 체크
  const autoLoginCheck = async () => {
    const isLogin = await AsyncStorage.getItem('isLogin');
    dispatch('isLogin', JSON.parse(isLogin ?? 'null'));
  };

  // 연결된 디바이스 리스트 확인
  const getConnectedDeviceList = async (): Promise<void> => {
    const local = await AsyncStorage.getItem('myDeviceList');
    const value: string = local || '[]';
    if (!local) AsyncStorage.setItem('myDeviceList', value);
    dispatch('myDeviceList', JSON.parse(value));
  };

  // 안드로이드 Back Button Click
  const androidBackBtnClick = (): (() => boolean) => {
    const backBtnClick = (): boolean => {
      const rootState = navigationRef?.getRootState();
      const name = rootState?.routes[rootState?.routes?.length - 1]?.name;

      if (name === 'home') {
        Alert.alert('NUNA', '앱을 종료하시겠습니까?', [
          {text: '취소'},
          {text: '확인', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      } else {
        return false;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', backBtnClick);
    return backBtnClick;
  };

  // BLE 응답 선언
  const bleResponseFn = (): void => {
    bleManagerEmitter.removeAllListeners(
      'BleManagerDidUpdateValueForCharacteristic',
    );
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      bleResponse,
    );
    console.log('-------- App Loaded --------', new Date());
  };

  // 권한 요청
  const getpermission = (): void => {
    if (os === 'android') androidLocationRequest(androidLocationRequest);
    if (os === 'ios') iosLocationRequest(iosLocationRequest);
  };

  // 배터리 상태 요청
  const getBattery = (): void => {
    if (!activeDevice) return;
    bleWrite({
      type: 'battery',
      value: [0x30],
    });
  };

  // 초기 셋팅
  useEffect(() => {
    // 첫 로딩 페이지 Hide
    SplashScreen.hide();
    // 권한 요청
    getpermission();
    // 블루투스 Init
    bleInit();
    // 자동로그인체크
    autoLoginCheck();
    // 연결된 디바이스 리스트 확인
    getConnectedDeviceList();
    // Response 이벤트 등록
    bleResponseFn();
    // 안드로이드 뒤로가기 버튼 클릭
    const backBtnClick = androidBackBtnClick();

    // Clean Up
    (): void => {
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );
      BackHandler.removeEventListener('hardwareBackPress', backBtnClick);
    };
  }, []);

  // 반복적으로 배터리 상태 요청
  useEffect((): (() => void) | void => {
    if (!activeDevice || !isBluetoothReady) return;
    let interval: NodeJS.Timer | undefined;

    clearInterval(interval);
    interval = setInterval(getBattery, 25 * 1000);

    return (): void => clearInterval(interval);
  }, [activeDevice?.id, isBluetoothReady]);

  // 앱 종료 시 장비 정지 요청
  useEffect(() => {
    const subscription = AppState.addEventListener('change', () => {
      let isExit = AppState?.currentState === 'background';
      if (isExit) return bleWrite({type: 'exit', value: [0x99]});
    });
    return () => subscription.remove();
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
