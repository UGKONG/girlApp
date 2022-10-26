import React, {useMemo} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {Use} from '../../types';

type Props = {data: Use};
export default function LogItem({data}: Props) {
  const date = useMemo(() => {
    let [_date, _time] = data?.USE_DATE?.split(' ');
    let [Y, M, D] = _date?.split('-');
    let [h, m, s] = _time?.split(':');
    let dateResult = `${Y}년${M}월${D}일`;
    let timeResult = `${h}시${m}분${s}초`;

    return dateResult + ' ' + timeResult;
  }, [data?.USE_DATE]);

  return (
    <Container>
      <Row style={{color: '#000'}}>사용일시: {date}</Row>
      <Row>사용장비: {data?.DEVICE_NAME}</Row>
      <Row>
        작동옵션: 모드 {data?.USE_MODE ?? 1}번 / 에너지 {data?.USE_POWER ?? 1}
        단계 / 타이머 {data?.USE_TIMER ?? 0}분
      </Row>
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: 5px;
  width: 100%;
  padding: 10px;
  background-color: #f7ecf3;
  border-radius: 4px;
`;
const Row = styled(Text)`
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 2px;
  color: #777;
`;
