import React from 'react';
import styled from 'styled-components/native';

const Scroll = (props: any): JSX.Element => {
  return <ScrollContainer {...props}>{props?.children}</ScrollContainer>;
};

const View = (props: any): JSX.Element => {
  return (
    <ViewContainer {...props}>
      <Background />
      <Contents>{props?.children}</Contents>
    </ViewContainer>
  );
};

const ScrollContainer = styled.ScrollView`
  padding: 10px;
  width: 100%;
  position: relative;
  background-color: #fff;
`;
const ViewContainer = styled.SafeAreaView`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
`;
const Contents = styled.View`
  width: 100%;
  height: 100%;
  padding: 10px;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;
const Background = styled.Image.attrs(() => ({
  source: require('../../assets/images/backgroundWater2.png'),
  resizeMode: 'cover',
}))`
  width: 100%;
  height: 35%;
  transform: scale(1);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default {Scroll, View};
