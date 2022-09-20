import React from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import logoImage from '../../assets/images/logo-black.png';
import {store} from '../functions';

export default function 해더() {
  const dispatch = store(x => x?.setState);

  const logout = () => {
    dispatch('isLogin', null);
    Alert.alert('로그아웃되었습니다.');
  };

  const menuOpen = () => {
    dispatch('isMenu', true);
  };

  return (
    <Container>
      <HeaderBtn onPress={menuOpen}>
        <Ionicons name="ios-menu" color="#E39CB8" size={38} />
      </HeaderBtn>
      <Logo />
      <HeaderBtn onPress={logout}>
        <MaterialIcons name="logout" color="#E39CB8" size={30} />
      </HeaderBtn>
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
const HeaderBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Logo = styled.Image.attrs(() => ({
  source: logoImage,
  resizeMode: 'contain',
}))`
  width: 100px;
  height: 44px;
`;
