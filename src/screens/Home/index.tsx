/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import {DurationList, StrengthList, Duration, Strength} from '../../types';
import {store} from '../../functions';
import Button from '../../components/Button';
import Container from '../../components/Container';

export default function 홈() {
  const durationList = useRef<DurationList>(['5', '10', '15', '20']);
  const strengthList = useRef<StrengthList>(['1', '2', '3', '4']);
  const [duration, setDuration] = useState<Duration>(null);
  const [strength, setStrength] = useState<Strength>(null);

  return (
    <Container.Scroll>
      <SymbolContainer>
        <SymbolImage />
        <BtnWrap>
          <MenuBtn>루나란..?</MenuBtn>
          <MenuBtn>사용방법</MenuBtn>
          <MenuBtn>SNS 둘러보기</MenuBtn>
          <MenuBtn>LUNA days</MenuBtn>
          <MenuBtn>dono.LUNA</MenuBtn>
          <MenuBtn>사용로그</MenuBtn>
        </BtnWrap>
      </SymbolContainer>
    </Container.Scroll>
  );
}

const SymbolContainer = styled.View`
  width: 100%;
  height: 60%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const SymbolImage = styled.Image.attrs(() => ({
  source: require('../../../assets/images/mainSymbol.png'),
  resizeMode: 'contain',
}))`
  width: 40%;
  margin-bottom: 20px;
`;
const BtnWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;
const MenuBtn = styled(Button)`
  flex: 1;
  min-width: 40%;
  max-width: 50%;
  margin: 5px;
  background-color: #fadeee;
`;
