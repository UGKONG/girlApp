/* eslint-disable curly */
import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import {MyDevice} from '../../types';
import DeviceItem from './DeviceItem';
import store from '../../store';

export default function 연결된장비(): JSX.Element {
  const activeDevice = store(x => x?.activeDevice);
  const LANG = store(x => x?.lang);

  const data = useMemo<MyDevice>(() => {
    if (!activeDevice) return {id: '0', name: ''};

    return {
      id: activeDevice?.id,
      name: activeDevice?.name,
    };
  }, [activeDevice]);

  return (
    <Container>
      <Header>
        <Title>{LANG === 'ko' ? '연결된 장비' : 'Connected Device'}</Title>
      </Header>
      <DeviceItem data={data} type="connect" />
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: 20px;
`;
const Header = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 3px;
`;
const Title = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #555555;
`;
