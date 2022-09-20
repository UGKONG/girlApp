import React from 'react';
import styled from 'styled-components/native';

export default function 물결배경() {
  return (
    <Container>
      <BackgroundWrap>
        <BackgroundImage />
      </BackgroundWrap>
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  height: 28%;
  position: absolute;
  bottom: 0;
  left: 0;
`;
const BackgroundWrap = styled.View`
  width: 100%;
  height: 100%;
  position: relative;
`;
const BackgroundImage = styled.Image.attrs(() => ({
  source: require('../../assets/images/backgroundWater2.png'),
}))`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
`;
