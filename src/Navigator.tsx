import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Header from './components/Header';
import HomeScreen from './screens/Home';
import HowScreen from './screens/How';
import SnsScreen from './screens/Sns';
import QuestionScreen from './screens/Question';
import LogScreen from './screens/Log';
import DaysScreen from './screens/Days';
import SettingScreen from './screens/Setting';

const Stack = createNativeStackNavigator();

export default function Navigator(): JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        header: props => <Header navigation={props?.navigation} />,
      }}>
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="question" component={QuestionScreen} />
      <Stack.Screen name="how" component={HowScreen} />
      <Stack.Screen name="sns" component={SnsScreen} />
      <Stack.Screen name="log" component={LogScreen} />
      <Stack.Screen name="days" component={DaysScreen} />
      <Stack.Screen name="setting" component={SettingScreen} />
    </Stack.Navigator>
  );
}
