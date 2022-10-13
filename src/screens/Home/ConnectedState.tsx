/* eslint-disable curly */
import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import store from '../../store';

export default function ConnectedState() {
  const data = store(x => x?.activeDevice);

  const battery = useMemo<{color: String; percent: number}>(() => {
    let color: string = '#00b200';
    if (!data?.battery) return {color: '#000', percent: 0};
    let percent: number = data?.battery;
    if (!percent) return {color: '#000', percent: 0};

    if (percent <= 20) color = '#ff8000';
    if (percent <= 10) color = '#ff0000';

    return {color, percent};
  }, [data?.battery]);

  return (
    <Container>
      {data ? (
        <>
          <Text>이름: LUNA-2022</Text>
          <Text>
            배터리:{' '}
            <Battery style={{color: battery?.color}}>
              {battery?.percent}%
            </Battery>
          </Text>
        </>
      ) : (
        <Text>장비를 연결해주세요.</Text>
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
`;
const Battery = styled.Text``;
