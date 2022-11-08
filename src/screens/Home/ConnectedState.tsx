/* eslint-disable curly */
import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import store from '../../store';

export default function ConnectedState() {
  const data = store(x => x?.activeDevice);
  const LANG = store(x => x?.lang);

  type Battery = {
    color: String;
    percent: number;
    isPowerConnect: boolean;
  };
  const battery = useMemo<Battery>(() => {
    let color: string = '#00b200';
    let isPowerConnect: boolean = data?.isPowerConnect ?? false;
    if (!data?.battery) return {color: '#000', percent: 0, isPowerConnect};
    let percent: number = data?.battery;
    if (!percent) return {color: '#000', percent: 0, isPowerConnect};

    if (percent <= 20) color = '#ff8000';
    if (percent <= 10) color = '#ff0000';

    return {color, percent, isPowerConnect};
  }, [data]);

  return (
    <Container>
      {data ? (
        <>
          <Text>
            {LANG === 'ko' ? '이름' : 'Name'}: {data?.name ?? '-'}
          </Text>
          <Text>
            {LANG === 'ko' ? '배터리' : 'Battery'}:{' '}
            <Battery style={{color: battery?.color}}>
              {battery?.percent}%{' '}
              {battery?.isPowerConnect
                ? LANG === 'ko'
                  ? '(충전중)'
                  : '(Charging)'
                : ''}
            </Battery>
          </Text>
        </>
      ) : (
        <Text>
          {LANG === 'ko'
            ? '장비를 연결해주세요.'
            : 'Please connect the device.'}
        </Text>
      )}
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  margin-bottom: 10px;
  padding: 0 40px;
`;
const Text = styled.Text`
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #777777;
`;
const Battery = styled.Text``;
