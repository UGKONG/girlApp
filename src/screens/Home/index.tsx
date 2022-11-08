/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */

import React, {useEffect, useMemo, useState} from 'react';
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
import useAxios from '../../../hooks/useAxios';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Entypo';

export const modeList: number[] = [1, 2, 3, 4, 5];
export const powerList: number[] = [1, 2, 3, 4, 5];
export const timerList: number[] = [5, 6, 7, 8, 9, 10, 11];

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
};
export default function 홈({navigation}: Props): JSX.Element {
  const bleWrite = useBluetoothWrite();
  const dispatch = store(x => x?.setState);
  const isLogin = store(x => x?.isLogin);
  const activeDevice = store(x => x?.activeDevice);
  const remoteState = store(x => x?.remoteState);
  const LANG = store(x => x?.lang);
  const possibleDeviceName = store(x => x?.possibleDeviceName);
  const [time, setTime] = useState<null | number>(null);

  type RemoteList = {
    id: number;
    name: string;
    list: number[];
    color: string;
    value: number | undefined;
    setValue: (val: number) => void;
  };
  const remoteList = useMemo<RemoteList[]>(
    () => [
      {
        id: 1,
        name: LANG === 'ko' ? '모드' : 'Mode',
        list: modeList,
        color: '#e46b8b',
        value: remoteState?.mode,
        setValue: (val: number) => {
          bleWrite({
            type: 'mode',
            value: [0x70 + val],
          });
        },
      },
      {
        id: 2,
        name: LANG === 'ko' ? '에너지' : 'Energy',
        list: powerList,
        color: '#e46b8b',
        value: remoteState?.power,
        setValue: (val: number) => {
          bleWrite({
            type: 'power',
            value: [0x50 + val],
          });
        },
      },
      {
        id: 3,
        name: LANG === 'ko' ? '타이머 (분)' : 'Timer (min)',
        list: timerList,
        color: '#e46b8b',
        value: remoteState?.timer,
        setValue: (val: number) => {
          bleWrite({
            type: 'timer',
            value: [0x10 + (val - 4)],
          });
        },
      },
    ],
    [remoteState, activeDevice],
  );

  // 장비 시작 플래그
  const isOn = useMemo<boolean>(() => {
    if (!activeDevice?.isOn) return false;
    return true;
  }, [activeDevice?.isOn]);

  // Timer 퍼센트
  const timePercent = useMemo<number>(() => {
    if (!remoteState?.timer || !time) return 0;
    let result = (time / (remoteState?.timer * 60)) * 100;
    return result <= 0 ? 0 : result >= 100 ? 100 : result;
  }, [time, remoteState?.timer]);

  // Timer Color
  type TimeColor = {color: '#fff' | '#fac291' | '#ff0000'};
  const timeColor = useMemo<TimeColor>(() => {
    if (!time) return {color: '#fff'};
    if (time <= 30) return {color: '#ff0000'};
    if (time <= 120) return {color: '#fac291'};
    return {color: '#fff'};
  }, [time]);

  // 충전중 여부
  const isPowerConnect = useMemo<boolean>(() => {
    if (!activeDevice) return false;
    return activeDevice?.isPowerConnect;
  }, [activeDevice?.isPowerConnect]);

  // 언어
  const isKo = useMemo<boolean>(() => {
    return LANG === 'ko';
  }, [LANG]);

  // 시작 정보 저장
  const createStartInfo = (): void => {
    const data = {
      APP_PLATFORM: possibleDeviceName,
      USER_ID: isLogin?.USER_ID,
      DEVICE_ID: activeDevice?.id,
      DEVICE_NAME: activeDevice?.name,
      USE_MODE: remoteState?.mode,
      USE_POWER: remoteState?.power,
      USE_TIMER: remoteState?.timer,
      USE_BATTERY: activeDevice?.battery,
    };
    useAxios
      .post('/device/use', data)
      .then(() => {})
      .catch(() => {});
  };

  // 루나 시작 (시작 플래그, 시작 신호 요청)
  const startLuna = async (): Promise<void> => {
    let timerSeconds = remoteState?.timer ? remoteState?.timer * 60 : 0;
    setTime(timerSeconds);
    dispatch('activeDevice', {...activeDevice, isOn: true});
    bleWrite({type: 'on', value: [0x42]});

    createStartInfo();
    Toast.show({
      text1: LANG === 'ko' ? '장비가 시작되었습니다.' : 'Device started.',
      text2:
        LANG === 'ko'
          ? '장비 진행중에는 타이머 설정이 불가능합니다.'
          : 'Timer setting is not possible while the device is in progress.',
    });
  };

  // 루나 정지 (정지 플래그, 정지 신호 요청)
  const stopLuna = (): void => {
    setTime(null);
    dispatch('activeDevice', {...activeDevice, isOn: false});
    bleWrite({type: 'off', value: [0x40]});
  };

  // 타임 프로세스
  const timeProcess = () => {
    let interval: null | NodeJS.Timer = null;
    // 꺼져있거나, 타임 정보가 없으면 Return
    if (!isOn || time === null) return;

    let _timer = time;
    let count = 1;

    // 반복 로직
    interval = setInterval(() => {
      let result = _timer - count;
      count++;

      if (result >= 0) return setTime(result);

      stopLuna();
      clearInterval(interval as NodeJS.Timeout);
    }, 1000);

    return () => {
      clearInterval(interval as NodeJS.Timeout);
    };
  };

  // 시작, 정지 시 실행 로직
  useEffect(timeProcess, [isOn]);

  // JSX
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
                  <SliderTouchHelpWrap>
                    {item?.list?.map((x, i) => (
                      <SliderTouchHelp key={i}>
                        <SliderText
                          onPress={() => item?.setValue(x)}
                          key={item?.name + x}
                          count={item?.list?.length}
                          idx={i}
                          active={Number(x) === item?.value}
                          ismargin={x >= 10}>
                          {x}
                        </SliderText>
                      </SliderTouchHelp>
                    ))}
                  </SliderTouchHelpWrap>
                  <Slider
                    step={listStep(item?.list)}
                    min={listFirst(item?.list)}
                    max={listLast(item?.list)}
                    color={item?.color}
                    value={item?.value ?? item?.list[0]}
                    setValue={item?.setValue}
                    disabled={item?.id === 3 && isOn}
                  />
                </SliderContainer>
              </Row>
            ))}
            <Row>
              {isLogin ? (
                <>
                  <SubmitBtn isOn={isOn || isPowerConnect} onPress={startLuna}>
                    <Icon
                      name="controller-play"
                      color={isOn || isPowerConnect ? '#959092' : '#e46b8b'}
                      size={26}
                    />
                  </SubmitBtn>
                  <SubmitBtn onPress={stopLuna}>
                    <Icon name="controller-stop" color="#e46b8b" size={26} />
                  </SubmitBtn>
                </>
              ) : (
                <LoginDescription>
                  {isKo
                    ? '로그인을 해야 사용이 가능합니다.'
                    : 'You must login to use it.'}
                </LoginDescription>
              )}
            </Row>

            {/* 프로그래스 바 */}
            {isLogin ? (
              <ProgressBarContainer>
                {isOn ? (
                  <>
                    <ProgressStatus style={timeColor}>
                      {isKo
                        ? (time ?? 0) + '초 후 자동 정지'
                        : 'Auto stop after ' + (time ?? 0) + ' seconds'}
                    </ProgressStatus>
                    <ProgressBarWrap>
                      <ProgressBar percent={timePercent} />
                    </ProgressBarWrap>
                  </>
                ) : (
                  <ProgressStatus>
                    {isPowerConnect &&
                      isKo &&
                      '충전중에는 사용이 불가능합니다.'}

                    {!isPowerConnect && isKo && '루나 시작이 필요합니다.'}

                    {isPowerConnect &&
                      !isKo &&
                      'It cannot be used while charging.'}

                    {isPowerConnect && !isKo && 'LUNA needs to start.'}
                  </ProgressStatus>
                )}
              </ProgressBarContainer>
            ) : null}
          </RemoteContainer>
        </>
      ) : (
        <DeviceUndefined onPress={() => navigation.navigate('setting')}>
          <DeviceUndefinedBg />
          <DeviceUndefinedText>
            {LANG === 'ko'
              ? '장비를 연결해주세요.'
              : 'Please connect the device.'}
          </DeviceUndefinedText>
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
  justify-content: space-between;
  padding-top: 20px;
`;
export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
`;
export const RowTitle = styled.Text`
  width: 100px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #da6e89;
  margin-right: 10px;
  white-space: nowrap;
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
  color: ${(x: SlideTextProps) => (x?.active ? '#d0446a' : '#fe94af')};
  font-weight: ${(x: SlideTextProps) => (x?.active ? 700 : 400)};
  position: absolute;
  top: 120%;
  white-space: nowrap;
  word-break: keep-all;
  width: 24px;
  text-align: center;
`;
type SubmitBtnProps = {isOn: boolean};
export const SubmitBtn = styled.TouchableOpacity.attrs((x: SubmitBtnProps) => ({
  disabled: x?.isOn,
}))`
  /* width: 70px;
  height: 70px;
  padding-left: 10px;
  padding-right: 8px; */
  padding: 12px 16px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  border: 3px solid #fff;
  background-color: ${(x: SubmitBtnProps) => (x?.isOn ? '#ddd' : '#fce7eb')};
  margin: 10px 40px 0;
`;
export const SubmitBtnText = styled.Text`
  color: ${(x: SubmitBtnProps) => (x?.isOn ? '#aaa' : '#e87ea7')};
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
const SliderTouchHelpWrap = styled.View`
  position: absolute;
  width: 100%;
  top: 4px;
  left: 0;
  padding: 0 9px;
  flex-direction: row;
  justify-content: space-between;
`;
const SliderTouchHelp = styled.View`
  min-width: 15px;
  min-height: 15px;
  max-width: 15px;
  max-height: 15px;
  border-radius: 15px;
  background-color: #e46b8b11;
  position: relative;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;
const ProgressBarContainer = styled.View`
  width: 100%;
  height: 31px;
`;
const ProgressStatus = styled.Text`
  font-size: 14px;
  padding: 2px 4px;
  color: #fff;
`;
const ProgressBarWrap = styled.View`
  width: 100%;
  height: 5px;
  border-radius: 10px;
  background-color: #ffffff80;
  overflow: hidden;
`;
type ProgressBarProps = {percent: number};
const ProgressBar = styled.View`
  background-color: #e46b8b;
  width: ${(x: ProgressBarProps) => x?.percent ?? 100}%;
  height: 100%;
`;
