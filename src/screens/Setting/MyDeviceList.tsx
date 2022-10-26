import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import {MyDevice} from '../../types';
import DeviceItem from './DeviceItem';
import store from '../../store';

export default function 내장비_리스트(): JSX.Element {
  const list = store<MyDevice[]>(x => x?.myDeviceList);

  const count = useMemo(() => list?.length ?? 0, [list]);

  return (
    <Container>
      <Header>
        <Title>내장비</Title>
        <Count>{count}개</Count>
      </Header>
      <List>
        {list?.length === 0 ? (
          <DescriptionText>등록된 내장비가 없습니다.</DescriptionText>
        ) : (
          list?.map(item => <DeviceItem type="my" key={item?.id} data={item} />)
        )}
      </List>
    </Container>
  );
}

export const DescriptionText = styled.Text`
  text-align: center;
  padding: 20px 0;
  color: #dc9fc5aa;
`;
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
  color: #555555;
`;
export const Count = styled.Text`
  color: #777777;
`;
export const List = styled.View`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  background-color: #fce9f1;
  border: 2px solid #fedeec;
  border-radius: 10px;
`;
