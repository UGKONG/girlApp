import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Default from './Default';
import Day from './Day';
import Month from './Month';

const Stack = createNativeStackNavigator();

export default function 캘린더() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Default" component={Default} />
      <Stack.Screen name="DayScreen" component={Day} />
      <Stack.Screen name="MonthScreen" component={Month} />
    </Stack.Navigator>
  );
}
