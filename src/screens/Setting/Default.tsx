import React from 'react';
import {Container, Button, ButtonText} from '../../styles';

export default function 기본({navigation}: any) {
  return (
    <Container.Scroll>
      <Button onPress={() => navigation.push('DeviceSettingScreen')}>
        <ButtonText>Device Setting</ButtonText>
      </Button>
      <Button onPress={() => navigation.push('ApplicationSettingScreen')}>
        <ButtonText>Application Setting</ButtonText>
      </Button>
    </Container.Scroll>
  );
}
