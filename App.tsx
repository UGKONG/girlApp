import React, {useRef} from 'react';
import styled from 'styled-components/native';
import {Modal, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {mainColor} from './src/styles';
import Header from './src/components/Header';
import {store} from './src/functions';

import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/Home';
import CalendarScreen from './src/screens/Calendar';
import SettingScreen from './src/screens/Setting';

const Tab = createBottomTabNavigator();

export default function App() {
  const tabIconList = useRef<{[key: string]: string[]}>({
    Home: ['ios-home-outline', 'ios-home'],
    Calendar: ['ios-calendar-outline', 'ios-calendar'],
    Setting: ['ios-ellipsis-horizontal', 'ios-ellipsis-horizontal'],
    Other: ['ios-help', 'ios-help'],
  });
  const {isLogin, isModal, setState: dispatch} = store(x => x);

  const screenOptions = ({route}: {route: {name: string}}) => ({
    tabBarIcon: ({focused}: {focused: boolean}): React.ReactElement => {
      let routeName: string = route.name;
      let iconName: string = tabIconList.current[routeName][focused ? 1 : 0];
      let iconColor: string = focused ? mainColor : 'gray';
      let iconSize: number = 24;

      return <Icon name={iconName} color={iconColor} size={iconSize} />;
    },
    headerShown: false,
    tabBarActiveTintColor: mainColor,
    tabBarStyle: {paddingBottom: 2},
  });

  if (!isLogin) return <LoginScreen />;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Header />
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Setting" component={SettingScreen} />
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
