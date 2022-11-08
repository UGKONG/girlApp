import React, {useMemo} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import store from '../../store';
import {Use} from '../../types';

type Props = {data: Use};
export default function LogItem({data}: Props) {
  const LANG = store(x => x?.lang);

  const date = useMemo(() => {
    let [_date, _time] = data?.USE_DATE?.split(' ');
    let [Y, M, D] = _date?.split('-');
    let [h, m, s] = _time?.split(':');
    let dateResult = `${Y}. ${M}. ${D}. `;
    let timeResult = `${h}:${m}:${s}`;

    return dateResult + ' ' + timeResult;
  }, [data?.USE_DATE]);

  return (
    <Container>
      <Row style={{color: '#000'}}>
        {LANG === 'ko' ? '사용일시' : 'Date'}: {date}
      </Row>
      <Row>
        {LANG === 'ko' ? '사용장비' : 'Device'}: {data?.DEVICE_NAME}
      </Row>
      <Row>
        {LANG === 'ko' ? '작동옵션' : 'Options'}:{' '}
        {LANG === 'ko' ? '모드' : 'Mode'} {data?.USE_MODE ?? 1} /{' '}
        {LANG === 'ko' ? '에너지' : 'Energy'} {data?.USE_POWER ?? 1} /{' '}
        {LANG === 'ko' ? '타이머' : 'Timer'} {data?.USE_TIMER ?? 0}
        {LANG === 'ko' ? '분' : 'min'}
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
