/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import Slider from '../../components/Slider';
import store from '../../store';
import SymbolMenu from './SymbolMenu';
import ConnectedState from './ConnectedState';
import deviceImage from '../../../assets/images/login-device.png';
import useBluetoothWrite from '../../../hooks/useBluetoothWrite';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ParamListBase} from '@react-navigation/native';
import type {SetState} from '../../types';

export const modeList: number[] = [1, 2, 3, 4, 5];
export const powerList: number[] = [1, 2, 3, 4, 5];
export const timerList: number[] = [5, 6, 7, 8, 9];

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
};
export default function 홈({navigation}: Props): JSX.Element {
  const bleWrite = useBluetoothWrite();
  const dispatch = store(x => x?.setState);
  const isBluetoothReady = store(x => x?.isBluetoothReady);
  const isLogin = store(x => x?.isLogin);
  const activeDevice = store(x => x?.activeDevice);
  const remoteState = store(x => x?.remoteState);

  type RemoteList = {
    name: string;
    list: number[];
    color: string;
    value: number | undefined;
    setValue: SetState<number>;
  };
  const remoteList = useMemo(
    (): RemoteList[] => [
      {
        name: '모드',
        list: modeList,
        color: '#e46b8b',
        value: remoteState?.mode,
        setValue: val => {
          dispatch('remoteState', {...remoteState, mode: val});
        },
      },
      {
        name: '에너지',
        list: powerList,
        color: '#e46b8b',
        value: remoteState?.power,
        setValue: val => {
          dispatch('remoteState', {...remoteState, power: val});
        },
      },
      {
        name: '타이머 (분)',
        list: timerList,
        color: '#e46b8b',
        value: remoteState?.timer,
        setValue: val => {
          dispatch('remoteState', {...remoteState, timer: val});
        },
      },
    ],
    [remoteState],
  );

  // 루나 시작
  const startLuna = (): void => {
    const str: string = `에너지: ${remoteState?.power}단계, 타이머: ${remoteState?.timer}분`;
    Alert.alert('LUNA', str);

    if (activeDevice?.id) {
      bleWrite({
        type: 'on',
        id: activeDevice?.id,
        value: [0x42],
      });
    }
  };

  // 루나 정지
  const stopLuna = (): void => {
    const str: string = '정지되었습니다.';
    Alert.alert('LUNA', str);

    if (activeDevice?.id) {
      bleWrite({
        type: 'off',
        id: activeDevice?.id,
        value: [0x40],
      });
    }
  };

  // 모드 변경 시
  useEffect(() => {
    if (isBluetoothReady && activeDevice && remoteState?.mode) {
      bleWrite({
        type: 'mode',
        id: activeDevice?.id,
        value: [0x70 + remoteState?.mode],
      });
    }
  }, [remoteState?.mode]);

  // 에너지 변경 시
  useEffect(() => {
    if (isBluetoothReady && activeDevice && remoteState?.power) {
      bleWrite({
        type: 'power',
        id: activeDevice?.id,
        value: [0x50 + remoteState?.power],
      });
    }
  }, [remoteState?.power]);

  // 타이머 변경 시
  useEffect(() => {
    if (isBluetoothReady && activeDevice && remoteState?.timer) {
      bleWrite({
        type: 'timer',
        id: activeDevice?.id,
        value: [0x80 + remoteState?.timer],
      });
    }
  }, [remoteState?.timer]);

  return (
    <Container.View>
      <SymbolMenu navigation={navigation} />
      {activeDevice ? (
        <>
          <ConnectedState />
          <RemoteContainer>
            {remoteList?.map(item => (
              <Row key={item?.name}>
                <RowTitle>{item?.name}</RowTitle>
                <SliderContainer>
                  <SliderTextWrap>
                    {item?.list?.map((txt, i) => (
                      <SliderText
                        onPress={() => item?.setValue(txt)}
                        key={item?.name + txt}
                        count={item?.list?.length}
                        idx={i}
                        active={Number(txt) === item?.value}
                        ismargin={txt >= 10}>
                        {txt}
                      </SliderText>
                    ))}
                  </SliderTextWrap>
                  <Slider
                    step={listStep(item?.list)}
                    min={listFirst(item?.list)}
                    max={listLast(item?.list)}
                    color={item?.color}
                    value={item?.value ?? item?.list[0]}
                    setValue={item?.setValue}
                  />
                </SliderContainer>
              </Row>
            ))}
            <Row>
              {isLogin ? (
                <>
                  <SubmitBtn onPress={startLuna}>
                    <SubmitBtnText>루나 시작</SubmitBtnText>
                  </SubmitBtn>
                  <SubmitBtn onPress={stopLuna}>
                    <SubmitBtnText>정지</SubmitBtnText>
                  </SubmitBtn>
                </>
              ) : (
                <LoginDescription>
                  로그인을 해야 사용이 가능합니다.
                </LoginDescription>
              )}
            </Row>
          </RemoteContainer>
        </>
      ) : (
        <DeviceUndefined onPress={() => navigation.navigate('setting')}>
          <DeviceUndefinedBg />
          <DeviceUndefinedText>장비를 연결해주세요.</DeviceUndefinedText>
        </DeviceUndefined>
      )}
    </Container.View>
  );
}
// 리스트 Step, Min, Max
export const listStep = (list: number[]): number => list[1] - list[0];
export const listFirst = (list: number[]): number => list[0];
export const listLast = (list: number[]): number => list[list?.length - 1];

const RemoteContainer = styled.View`
  width: 100%;
  flex: 1;
  justify-content: space-around;
`;
export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;
export const RowTitle = styled.Text`
  width: 100px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #da6e89;
  margin-right: 10px;
`;
export const SliderContainer = styled.View`
  position: relative;
  flex: 1;
`;
export const SliderTextWrap = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0 11px;
  width: 100%;
  height: 24px;
  flex-direction: row;
  justify-content: space-between;
`;
type SlideTextProps = {
  count: number;
  idx: number;
  active: boolean;
  ismargin: boolean;
};
export const SliderText = styled.Text`
  color: ${(x: SlideTextProps) => (x?.active ? '#d0446a' : '#ed95ab')};
  font-weight: ${(x: SlideTextProps) => (x?.active ? 700 : 400)};
  transform: translateX(
    ${(x: SlideTextProps) => (x?.ismargin ? '4px' : '0px')}
  );
`;
export const SubmitBtn = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  border-radius: 20px;
  border: 3px solid #fff;
  padding-left: 10px;
  padding-right: 8px;
  justify-content: center;
  align-items: center;
  background-color: #fce7eb;
  margin: 0 60px;
`;
export const SubmitBtnText = styled.Text`
  color: #e87ea7;
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 1px;
`;
const LoginDescription = styled.Text`
  height: 70px;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  /* color: #e87ea7; */
  color: #ffffff;
  padding: 20px 0;
`;
const DeviceUndefinedBg = styled.ImageBackground.attrs(() => ({
  source: deviceImage,
  resizeMode: 'contain',
}))`
  position: absolute;
  right: -20px;
  bottom: 0;
  width: 250px;
  height: 250px;
`;
const DeviceUndefined = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 1,
}))`
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const DeviceUndefinedText = styled.Text`
  font-size: 18px;
  color: #7e7e7e;
`;
