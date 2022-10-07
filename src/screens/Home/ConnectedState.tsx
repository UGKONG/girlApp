import React from 'react';
import styled from 'styled-components/native';
import store from '../../store';

export default function ConnectedState() {
  const data = store(x => x?.activeDevice);

  return (
    <Container>
      {data ? (
        <>
          <Text>이름: LUNA-2022</Text>
          <Text>배터리: 90%</Text>
        </>
      ) : (
        <Text>장비를 연결해주세요.</Text>
      )}
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  background-color: #f00;
  margin-bottom: 10px;
  padding: 0 40px;
`;
const Text = styled.Text`
  flex: 1;
  text-align: center;
`;
