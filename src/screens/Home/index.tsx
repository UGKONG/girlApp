/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {RadioButton} from 'react-native-paper';
import {DurationList, StrengthList, Duration, Strength} from '../../types';
import {Button, ButtonText, Container} from '../../styles';
import text from '../../text.json';
import {store} from '../../functions';

export default function 홈() {
  const {setting} = store(x => x);
  const durationList = useRef<DurationList>(['5', '10', '15', '20']);
  const strengthList = useRef<StrengthList>(['1', '2', '3', '4']);
  const [duration, setDuration] = useState<Duration>(null);
  const [strength, setStrength] = useState<Strength>(null);

  return (
    <Container.Scroll>
      <Row.Container>
        <Row.Title>{text.duration[setting.lang]}</Row.Title>
        <Row.Contents>
          {durationList.current.map(item => (
            <RadioContainer key={item}>
              <Radio
                color={setting.color}
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
        <Row.Title>{text.strength[setting.lang]}</Row.Title>
        <Row.Contents>
          {strengthList.current.map(item => (
            <RadioContainer key={item}>
              <Radio
                color={setting.color}
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
        <Row.Title>{text.battery[setting.lang]}</Row.Title>
        <Row.Contents>
          <BatteryProgress color={setting.color} />
        </Row.Contents>
      </Row.Container>

      <Row.Container style={{marginTop: 30}}>
        <Button color={setting.color}>
          <ButtonText>{text.pause[setting.lang]}</ButtonText>
        </Button>
        <Button color={setting.color}>
          <ButtonText>{text.start[setting.lang]}</ButtonText>
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
  uncheckedColor: '#ddd',
}))`
  width: 25%;
`;
const BatteryProgress = styled.View`
  width: 30%;
  background-color: ${(x: {color?: string}) => x?.color};
`;
