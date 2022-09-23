/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable curly */
import React, {useEffect} from 'react';
import {Platform, StatusBar, BackHandler, Alert} from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {request, PERMISSIONS} from 'react-native-permissions';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {store} from './functions';
import MyNavigator from './navigator';
import SideMenu from './components/SideMenu';
import LoginScreen from './screens/Login';
import Toast, {ToastConfigParams} from 'react-native-toast-message';

const os = Platform.OS;

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const isModal = store<boolean>(x => x?.isModal);
  const dispatch = store(x => x?.setState);

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

  // 권한 요청
  useEffect((): void => {
    if (os === 'android') androidLocationRequest(androidLocationRequest);
    if (os === 'ios') iosLocationRequest(iosLocationRequest);
  }, []);

  // 안드로이드 뒤로가기 버튼 클릭
  useEffect(() => {
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

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="light-content" />

      <MyNavigator />

      <Modal visible={isModal}>
        <CloseBtn onPress={() => dispatch('isModal', false)}>
          <CloseIcon />
        </CloseBtn>
        <LoginScreen />
      </Modal>

      <SideMenu navigationRef={navigationRef} />
      <Toast />
    </NavigationContainer>
  );
}

const Modal = styled.Modal.attrs(() => ({
  transparent: false,
  animationType: 'slide',
  presentationStyle: 'formSheet',
}))``;
const CloseBtn = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 10px;
  right: 10px;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;
const CloseIcon = styled(Icon).attrs(() => ({
  name: 'ios-arrow-down',
  color: '#ccc',
  size: 26,
}))``;
