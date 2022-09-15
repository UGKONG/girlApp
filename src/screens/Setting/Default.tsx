import React from 'react';
import {store} from '../../functions';
import {Container, Button, ButtonText} from '../../styles';
import text from '../../text.json';

export default function 기본({navigation}: any) {
  const {setting} = store(x => x);

  return (
    <Container.Scroll>
      <Button
        color={setting.color}
        onPress={() => navigation.push('DeviceSettingScreen')}>
        <ButtonText>{text.deviceSetting[setting.lang]}</ButtonText>
      </Button>
      <Button
        color={setting.color}
        onPress={() => navigation.push('ApplicationSettingScreen')}>
        <ButtonText>{text.ApplicationSetting[setting.lang]}</ButtonText>
      </Button>
    </Container.Scroll>
  );
}
