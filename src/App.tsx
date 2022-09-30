/* eslint-disable curly */
import React, {useEffect} from 'react';
import {Platform, StatusBar, BackHandler, Alert} from 'react-native';
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

const os = Platform.OS;

export default function App(): JSX.Element {
  const navigationRef = useNavigationContainerRef();
  const dispatch = store(x => x?.setState);
  const isModal = store<boolean>(x => x?.isModal);

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
  type AsyncStorageError = Error | null | undefined;
  type AsyncStorageResult = string | null | undefined;
  const autoLoginCheck = () => {
    AsyncStorage.getItem(
      'isLogin',
      (err: AsyncStorageError, result: AsyncStorageResult): void => {
        if (err || !result) return;
        dispatch('isLogin', JSON.parse(result));
      },
    );
  };

  // 권한 요청
  useEffect((): void => {
    if (os === 'android') androidLocationRequest(androidLocationRequest);
    if (os === 'ios') iosLocationRequest(iosLocationRequest);
  }, []);

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
