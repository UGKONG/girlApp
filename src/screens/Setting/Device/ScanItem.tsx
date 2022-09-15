/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useMemo} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import BleManager from 'react-native-ble-manager';
import type {SetConnectedInfo, Device} from '../../../types';

interface Props {
  data: Device;
  setConnectedInfo: SetConnectedInfo;
}
const ScanItem = ({data, setConnectedInfo}: Props) => {
  const onClick = () => {
    BleManager.connect(data?.id)
      .then(() => {
        setConnectedInfo({id: data?.id, detail: null});
        Alert.alert('연결되었습니다.');
      })
      .catch(() => {
        setConnectedInfo(null);
        Alert.alert('연결에 실패하였습니다.');
      });
  };

  const title = useMemo(() => {
    let result = data?.id;
    if (data?.name) {
      result += ` (${data?.name})`;
    }
    return result;
  }, [data?.id, data?.name]);

  return (
    <Container onPress={onClick}>
      <ContainerText>{title}</ContainerText>
    </Container>
  );
};
export default ScanItem;

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  background: #13a323;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 6px;
`;
const ContainerText = styled.Text`
  color: #fff;
`;
