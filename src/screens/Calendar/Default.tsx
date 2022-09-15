import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {store} from '../../functions';
import text from '../../text.json';
import {Button, ButtonText, Container} from '../../styles';

export default function 기본({navigation}: any) {
  const {setting} = store(x => x);

  return (
    <Container.View>
      <Calendar>
        <Text>{text.calendar[setting.lang]}</Text>
      </Calendar>
      <Button
        color={setting.color}
        onPress={() => navigation.push('DayScreen')}>
        <ButtonText>개별 날짜 클릭 시</ButtonText>
      </Button>
      <Button
        color={setting.color}
        onPress={() => navigation.push('MonthScreen')}>
        <ButtonText>Analysis 클릭 시</ButtonText>
      </Button>
    </Container.View>
  );
}

const Calendar = styled.View`
  width: 100%;
  height: 50%;
  border: 1px solid #ddd;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;
