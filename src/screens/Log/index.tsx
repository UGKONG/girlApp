/* eslint-disable react-hooks/rules-of-hooks */
import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';
import {Calendar} from 'react-native-calendars';
import type {DayObject} from '../../types';
import {store, useDate} from '../../functions';

export default function 사용로그(): JSX.Element {
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
        {`dono.LUNA는 적극적으로 당신의 건강을 생각하며 신뢰성 있는 LUNA day 산출을 위하여 당신의 도움이 필요합니다. 다름아닌, dono.LUNA의 사용 로그입니다. 혁신적인 생리통 경감과 자궁의 건강을 위해서는 당신의 생리 일정과 dono.LUNA 사용 패턴이 큰 단서가 됩니다. 

고객님의 정보를 토대로 산출된 내용을 하기 달력에 표기 하오니 적극적인 dono.LUNA사용에 동참해 주시기 바랍니다.
        `}
      </TextPage.CommonText>

      <CustomCalendar
        monthFormat={'yyyy년 MM월'}
        enableSwipeMonths={true}
        onDayPress={onDayPress}
        markedDates={today}
      />
    </Container.Scroll>
  );
}

const CustomCalendar = styled(Calendar)`
  padding-bottom: 6px;
  border: 2px solid #f6e9f1;
  background-color: #f7ecf3;
`;
