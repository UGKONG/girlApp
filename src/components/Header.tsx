/* eslint-disable prettier/prettier */
import React from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import logoImage from '../../assets/images/logo-black.png';
import {store} from '../functions';
import {User} from '../types';
import Toast from 'react-native-toast-message';

type Props = {navigation: any};
export default function 해더({navigation}: Props) {
  const dispatch = store(x => x?.setState);
  const isLogin = store<null | User>(x => x?.isLogin);

  const logout = (): void => {
    dispatch('isLogin', null);

    Toast.show({
      type: 'success',
      text1: '로그아웃 되었습니다.',
      text2: '다음에 다시 만나요~',
    });
  };

  const login = (): void => {
    dispatch('isModal', true);
  };

  const menuOpen = (): void => {
    dispatch('isMenu', true);
  };

  return (
    <Container>
      <HeaderBtn onPress={menuOpen}>
        <Ionicons name="ios-menu" color="#E39CB8" size={38} />
      </HeaderBtn>
      <LogoContainer onPress={() => navigation.navigate('home')}>
        <Logo />
      </LogoContainer>
      <HeaderBtn onPress={isLogin ? logout : login}>
        <MaterialIcons
          name={isLogin ? 'logout' : 'login'}
          color="#E39CB8"
          size={30}
        />
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
  background-color: #fff;
`;
const HeaderBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LogoContainer = styled.TouchableOpacity`
  width: 100px;
  height: 44px;
`;
const Logo = styled.Image.attrs(() => ({
  source: logoImage,
  resizeMode: 'contain',
}))`
  width: 100px;
  height: 44px;
`;
