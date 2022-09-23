/* eslint-disable prettier/prettier */
import React, {useMemo, useRef, useState} from 'react';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import Slider from '../../components/Slider';
import {Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamListBase} from '@react-navigation/native';
import SymbolMenu from './SymbolMenu';
import {store} from '../../functions';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
};
export default function 홈({navigation}: Props) {
  const isLogin = store(x => x?.isLogin);
  const strengthList = useRef<number[]>([1, 2, 3, 4, 5]);
  const durationList = useRef<number[]>([5, 10, 15, 20, 25]);
  const [strength, setStrength] = useState<number>(strengthList?.current[1]);
  const [duration, setDuration] = useState<number>(durationList?.current[2]);
  const remoteList = useMemo(
    () => [
      {
        name: '에너지',
        list: strengthList?.current,
        color: '#e46b8b',
        value: strength,
        setValue: setStrength,
      },
      {
        name: '타이머 (분)',
        list: durationList?.current,
        color: '#e46b8b',
        value: duration,
        setValue: setDuration,
      },
    ],
    [duration, strength],
  );

  // 루나 시작
  const startLuna = (): void => {
    const str: string = `에너지: ${strength}단계, 타이머: ${duration}분`;
    Alert.alert(str);
  };

  // 루나 정지
  const stopLuna = (): void => {
    const str: string = '정지되었습니다.';
    Alert.alert(str);
  };

  return (
    <Container.View>
      <SymbolMenu navigation={navigation} />
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
                value={item?.value}
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
