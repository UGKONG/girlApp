/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import type {Peripheral} from 'react-native-ble-manager';
import ScanItem from './ScanItem';
import type {SetConnectedInfo} from '../../../types';

interface Props {
  list: Peripheral[];
  setConnectedInfo: SetConnectedInfo;
}
const ScanList = ({list, setConnectedInfo}: Props) => {
  return (
    <Scroll>
      {list?.length > 0 ? (
        list?.map((item, i) => (
          <ScanItem key={i} data={item} setConnectedInfo={setConnectedInfo} />
        ))
      ) : (
        <View>
          <Text style={{textAlign: 'center'}}>없음</Text>
        </View>
      )}
    </Scroll>
  );
};
export default ScanList;

const Scroll = styled.ScrollView`
  width: 90%;
  flex: 1;
  padding-top: 10px;
  padding-bottom: 10px;
`;
