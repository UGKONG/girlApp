import React from 'react';
import {Text, Platform} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Default from './Default';
import Device from './Device';
import Application from './Application';

const Stack = createNativeStackNavigator();
const os = Platform.OS;

export default function 설정() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Default" component={Default} />
      {os !== 'android' ? (
        <Text>준비중입니다.</Text>
      ) : (
        <Stack.Screen name="DeviceSettingScreen" component={Device} />
      )}
      <Stack.Screen name="ApplicationSettingScreen" component={Application} />
    </Stack.Navigator>
  );
}
