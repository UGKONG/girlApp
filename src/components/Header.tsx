import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import logoImage from '../../assets/images/logo-black.png';
import store from '../store';
import {User} from '../types';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {navigation: any};
export default function 해더({navigation}: Props) {
  const dispatch = store(x => x?.setState);
  const LANG = store(x => x?.lang);
  const isLogin = store<null | User>(x => x?.isLogin);

  const logout = (): void => {
    AsyncStorage.removeItem('isLogin');
    dispatch('isLogin', null);

    Toast.show({
      type: 'success',
      text1: LANG === 'ko' ? '로그아웃 되었습니다.' : 'Logout Success',
      text2: LANG === 'ko' ? '다음에 다시 만나요~' : 'bye~ bye~',
    });
  };

  const login = (): void => {
    dispatch('isModal', true);
    dispatch('loginRequired', false);
  };

  const menuOpen = (): void => {
    dispatch('isMenu', true);
  };

  useEffect(() => dispatch('navigation', navigation), [dispatch, navigation]);

  return (
    <Container>
      <HeaderBtn onPress={menuOpen}>
        <Ionicons name="ios-menu" color="#E39CB8" size={38} />
      </HeaderBtn>
      <LogoContainer onPress={() => navigation.navigate('home')}>
        <Logo />
      </LogoContainer>
      <HeaderBtn width={80} onPress={isLogin ? logout : login}>
        <LoginStatusText>
          {isLogin
            ? LANG === 'ko'
              ? '로그아웃'
              : 'Logout'
            : LANG === 'ko'
            ? '로그인'
            : 'Login'}
        </LoginStatusText>
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
  position: relative;
`;
type HeaderBtnProps = {width: number};
const HeaderBtn = styled.TouchableOpacity`
  height: 40px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
`;
const LogoContainer = styled.TouchableOpacity`
  width: 100px;
  height: 44px;
  position: absolute;
  left: 50%;
  transform: translateX(-40px);
`;
const Logo = styled.Image.attrs(() => ({
  source: logoImage,
  resizeMode: 'contain',
}))`
  width: 100px;
  height: 44px;
`;
const LoginStatusText = styled.Text`
  margin-right: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #e39cb8;
`;
