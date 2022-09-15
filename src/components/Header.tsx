import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {store} from '../functions';
import logoImage from '../../assets/images/logo.png';
import text from '../text.json';

export default function 해더() {
  const {isLogin, setState: dispatch, setting} = store(x => x);

  const login = () => {
    const LoginScreen = require('../screens/Login').default;
    dispatch('isModal', <LoginScreen />);
  };

  const logout = () => {
    dispatch('isLogin', null);
    dispatch('isModal', null);
  };

  return (
    <Container>
      <Logo />
      <UserCircle onPress={isLogin ? logout : login}>
        {!isLogin && <LoginText>{text.login[setting.lang]}</LoginText>}
        <Icon name="ios-person-circle" color="#ccc" size={40} />
      </UserCircle>
    </Container>
  );
}

const Container = styled.View`
  padding: 10px;
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Logo = styled.Image.attrs(() => ({
  source: logoImage,
  resizeMode: 'contain',
}))`
  width: 100px;
  height: 44px;
`;
const UserCircle = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  flex-direction: row;
  align-items: center;
`;
const LoginText = styled.Text`
  margin-right: 10px;
`;
