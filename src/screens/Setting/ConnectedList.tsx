import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import {Device} from '../../types';
import ScanItem from './ScanItem';
import store from '../../store';

export default function 연결된장비_리스트(): JSX.Element {
  const list = store<Device[]>(x => x?.connectDeviceList);

  const count = useMemo(() => list?.length ?? 0, [list]);

  return (
    <Container>
      <Header>
        <Title>연결 장비</Title>
        <Count>{count}개</Count>
      </Header>
      <List>
        {list?.map(item => (
          <ScanItem type="connect" key={item?.id} data={item} />
        ))}
      </List>
    </Container>
  );
}

export const Container = styled.View`
  margin-bottom: 20px;
`;
export const Header = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 3px;
`;
export const Title = styled.Text`
  font-size: 15px;
  font-weight: 600;
`;
export const Count = styled.Text``;
export const List = styled.View`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  background-color: #fce9f1;
  border: 2px solid #fedeec;
  border-radius: 10px;
`;
