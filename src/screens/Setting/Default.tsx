import React from 'react';
import Button from '../../components/Button';
import Container from '../../components/Container';
// import {store} from '../../functions';

export default function 기본({navigation}: any) {
  // const setting = store(x => x?.setting);

  return (
    <Container.Scroll>
      <Button onPress={() => navigation.push('Device')}>장비 관리</Button>
      <Button onPress={() => navigation.push('Application')}>앱 설정</Button>
    </Container.Scroll>
  );
}
