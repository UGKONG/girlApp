/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable curly */
import React, {useCallback, useEffect, useRef} from 'react';
import {request, PERMISSIONS} from 'react-native-permissions';
import styled from 'styled-components/native';
import {Modal, Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from './src/components/Header';
import {store} from './src/functions';
import text from './src/text.json';

import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/Home';
import CalendarScreen from './src/screens/Calendar';
import SettingScreen from './src/screens/Setting';

const Tab = createBottomTabNavigator();
const os = Platform.OS;

export default function App() {
  const tabIconList = useRef<{readonly [key: string]: string[]}>({
    Home: ['ios-home-outline', 'ios-home'],
    Calendar: ['ios-calendar-outline', 'ios-calendar'],
    Setting: ['ios-ellipsis-horizontal', 'ios-ellipsis-horizontal'],
    Other: ['ios-help', 'ios-help'],
  });
  const {isLogin, isModal, setState: dispatch, setting} = store(x => x);

  const screenOptions = ({route}: {route: {name: string}}) => ({
    tabBarIcon: ({focused}: {focused: boolean}): React.ReactElement => {
      let routeName: string = route.name;
      let iconName: string = tabIconList.current[routeName][focused ? 1 : 0];
      let iconColor: string = focused ? setting.color : 'gray';
      let iconSize: number = 24;

      return <Icon name={iconName} color={iconColor} size={iconSize} />;
    },
    headerShown: false,
    tabBarActiveTintColor: setting.color,
    tabBarStyle: {paddingBottom: 2},
  });

  const androidLocationRequest = (fn: any) => {
    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(x => {
      if (x === 'denied') fn();
    });
  };

  const iosLocationRequest = (fn: any) => {
    request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(x => {
      if (x === 'denied') fn();
    });
  };

  const getSetting = useCallback(() => {
    dispatch('setting', {lang: 'ko', color: '#8ba7c0'});
  }, [dispatch]);

  // 권한 요청
  useEffect(() => {
    if (os === 'android') androidLocationRequest(androidLocationRequest);
    if (os === 'ios') iosLocationRequest(iosLocationRequest);

    getSetting();
  }, [getSetting]);

  // 개발중..
  // if (!isLogin) return <LoginScreen />;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Header />
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: text.home[setting.lang],
            }}
          />
          <Tab.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{
              tabBarLabel: text.calendar[setting.lang],
            }}
          />
          <Tab.Screen
            name="Setting"
            component={SettingScreen}
            options={{
              tabBarLabel: text.setting[setting.lang],
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <Modal
        visible={isModal ? true : false}
        transparent={false}
        animationType="slide"
        presentationStyle="formSheet">
        <CloseBtn onPress={() => dispatch('isModal', null)}>
          <CloseIcon />
        </CloseBtn>
        {isModal}
      </Modal>
    </>
  );
}

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
