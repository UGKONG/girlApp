/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useRef, useState} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {RadioButton} from 'react-native-paper';
import {Button, ButtonText, Container, mainColor} from '../../styles';

export default function 홈() {
  type DurationList = ['5', '10', '15', '20'];
  const durationList = useRef<DurationList>(['5', '10', '15', '20']);
  type StrengthList = ['1', '2', '3', '4'];
  const strengthList = useRef<StrengthList>(['1', '2', '3', '4']);

  type Duration = null | '5' | '10' | '15' | '20';
  const [duration, setDuration] = useState<Duration>(null);
  type Strength = null | '1' | '2' | '3' | '4';
  const [strength, setStrength] = useState<Strength>(null);

  return (
    <Container.Scroll>
      <Row.Container>
        <Row.Title>Duration</Row.Title>
        <Row.Contents>
          {durationList.current.map(item => (
            <RadioContainer key={item}>
              <Radio
                value={item}
                status={duration === item ? 'checked' : 'unchecked'}
                onPress={() => setDuration(item)}
              />
              <Text>{item}</Text>
            </RadioContainer>
          ))}
        </Row.Contents>
      </Row.Container>

      <Row.Container>
        <Row.Title>Strength</Row.Title>
        <Row.Contents>
          {strengthList.current.map(item => (
            <RadioContainer key={item}>
              <Radio
                value={item}
                status={strength === item ? 'checked' : 'unchecked'}
                onPress={() => setStrength(item)}
              />
              <Text>{item}</Text>
            </RadioContainer>
          ))}
        </Row.Contents>
      </Row.Container>

      <Row.Container>
        <Row.Title>Battery</Row.Title>
        <Row.Contents>
          <BatteryProgress />
        </Row.Contents>
      </Row.Container>

      <Row.Container style={{marginTop: 30}}>
        <Button>
          <ButtonText>Pause LUNA</ButtonText>
        </Button>
        <Button>
          <ButtonText>Good to go</ButtonText>
        </Button>
      </Row.Container>
    </Container.Scroll>
  );
}

const Row = {
  Container: styled.View`
    padding: 10px;
    margin-bottom: 10px;
  `,
  Title: styled.Text`
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 6px;
  `,
  Contents: styled.View`
    width: 100%;
    height: 50px;
    border: 1px solid #ddd;
    flex-direction: row;
  `,
};
const RadioContainer = styled.View`
  width: 25%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding-right: 10px;
`;
const Radio = styled(RadioButton).attrs(() => ({
  color: mainColor,
  uncheckedColor: '#ddd',
}))`
  width: 25%;
`;
const BatteryProgress = styled.View`
  width: 30%;
  background-color: ${mainColor};
`;
