/* eslint-disable react-hooks/rules-of-hooks */
import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';
import {Calendar} from 'react-native-calendars';
import type {DayObject} from '../../types';
import {store, useDate} from '../../functions';

export default function Days(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const isLogin = store(x => x?.isLogin);

  const onDayPress = (day: DayObject): void => {
    console.log(day);
  };

  type Today = {[key: string]: any};
  const today = useMemo((): Today => {
    let result: Today = {};

    result[useDate(undefined, 'date')] = {
      selected: true,
      selectedColor: '#E87EA6',
    };

    return result;
  }, []);

  useEffect((): void => {
    if (!isLogin) {
      dispatch('isModal', true);
      dispatch('loginRequired', true);
    }
  }, [dispatch, isLogin]);

  return (
    <Container.Scroll>
      <TextPage.CommonText>
        {`dono.LUNA는 LUNA day를 챙겨 드리고 싶습니다. LUNA day는 바쁜 생활 속에서 자칫 잊을 수 있는 생리 전 이틀을 말합니다. 그 날이 바로 dono.LUNA를 꼭 만나야 하는 날이니까요. 당신의 LUNA day를 위하여 시작일과 끝나는 날을 달력에 메모해 주시면 dono.LUNA가 LUNA day 를 챙겨 드릴 것입니다.
(자체 AI로 계산하므로 개인정보의 노출은 없습니다)
`}
      </TextPage.CommonText>

      <CustomCalendar
        monthFormat={'yyyy년 MM월'}
        enableSwipeMonths={true}
        onDayPress={onDayPress}
        markedDates={today}
      />

      <Tip>
        다음 LUNA day 는 10월 15일로 예상됩니다. 건강한 삶을 위하여 14일 부터는
        잊지 말고 dono.LUNA 하세요
      </Tip>
    </Container.Scroll>
  );
}

const Tip = styled.Text`
  padding: 10px;
  background-color: #ea8aaf;
  border-radius: 10px;
  color: #fff;
  line-height: 22px;
  margin-top: 10px;
`;
const CustomCalendar = styled(Calendar)`
  padding-bottom: 6px;
  border: 2px solid #f6e9f1;
  background-color: #f7ecf3;
`;
