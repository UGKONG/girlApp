import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import store from '../store';
import LoginScreen from '../screens/Login';
import {useNavigation} from '@react-navigation/native';

type Props = {isModal: boolean};
export default function 로그인_모달({isModal}: Props) {
  const navigator = useNavigation();
  const dispatch = store(x => x?.setState);
  const loginRequired = store<boolean>(x => x?.loginRequired);

  const close = () => {
    dispatch('isModal', false);
    if (loginRequired) {
      navigator.goBack();
      dispatch('loginRequired', false);
    }
  };

  return (
    <Container visible={isModal}>
      <CloseBtn onPress={close}>
        <CloseIcon />
      </CloseBtn>
      <LoginScreen />
    </Container>
  );
}

const Container = styled.Modal.attrs(() => ({
  transparent: false,
  animationType: 'slide',
  presentationStyled: 'formSheet',
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
