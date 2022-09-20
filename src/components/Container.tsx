import React from 'react';
import styled from 'styled-components/native';

const Scroll = (props: any) => {
  return <ScrollContainer {...props}>{props?.children}</ScrollContainer>;
};

const View = (props: any) => {
  return <ViewContainer {...props}>{props?.children}</ViewContainer>;
};

const ScrollContainer = styled.SafeAreaView`
  padding: 10px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;
const ViewContainer = styled.ScrollView`
  padding: 10px;
  position: relative;
`;

export default {Scroll, View};
