/* eslint-disable curly */
import React, {useEffect} from 'react';
import {request, PERMISSIONS} from 'react-native-permissions';
import styled from 'styled-components/native';
import {Platform, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {store} from './functions';
import Header from './components/Header';
import ScrollMenu from './components/ScrollMenu';
import Background from './components/BackgroundWater';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import HowScreen from './screens/How';
import HelpScreen from './screens/Help';
import SnsScreen from './screens/Sns';
import QuestionScreen from './screens/Question';
import LogScreen from './screens/Log';
import DaysScreen from './screens/Days';
import SettingScreen from './screens/Setting';

const os = Platform.OS;

export default function App() {
  const {isLogin, isModal, setState: dispatch, activeScreen} = store(x => x);

  // 안드로이드 위치 권한 요청
  const androidLocationRequest = (fn: any) => {
    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(x => {
      if (x === 'denied') fn();
    });
  };

  // IOS 위치 권한 요청
  const iosLocationRequest = (fn: any) => {
    request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(x => {
      if (x === 'denied') fn();
    });
  };

  // 권한 요청
  useEffect(() => {
    if (os === 'android') androidLocationRequest(androidLocationRequest);
    if (os === 'ios') iosLocationRequest(iosLocationRequest);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      {isLogin ? (
        <LoginScreen />
      ) : (
        <>
          <Header />
          <Background />
          {activeScreen === 'home' && <HomeScreen />}
          {activeScreen === 'question' && <QuestionScreen />}
          {activeScreen === 'how' && <HowScreen />}
          {activeScreen === 'help' && <HelpScreen />}
          {activeScreen === 'sns' && <SnsScreen />}
          {activeScreen === 'log' && <LogScreen />}
          {activeScreen === 'days' && <DaysScreen />}
          {activeScreen === 'setting' && <SettingScreen />}
          <Modal visible={isModal ? true : false}>
            <CloseBtn onPress={() => dispatch('isModal', null)}>
              <CloseIcon />
            </CloseBtn>
            {isModal}
          </Modal>
        </>
      )}
      <ScrollMenu />
    </>
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
