/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */

import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';
import {Calendar} from 'react-native-calendars';
import type {CalendarSelectDate, DayObject, Use} from '../../types';
import {useDate} from '../../functions';
import store from '../../store';
import useAxios from '../../../hooks/useAxios';
import {ScrollView} from 'react-native';
import LogItem from './LogItem';

export default function 사용로그(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const isLogin = store(x => x?.isLogin);
  const LANG = store(x => x?.lang);
  const possibleDeviceName = store(x => x?.possibleDeviceName);
  const [list, setList] = useState<Use[]>([]);
  const [YM, setYM] = useState<string>(
    useDate(undefined, 'date')?.replace('-', '')?.slice(0, 6),
  );

  const getUseList = (): void => {
    if (!isLogin?.USER_ID || !YM) return;

    useAxios
      .get('/device/use', {
        params: {
          USER_ID: isLogin?.USER_ID as number,
          APP_PLATFORM: possibleDeviceName,
          YM,
        },
      })
      .then(({data}) => {
        if (!data?.result) return setList([]);
        setList(data?.current);
      })
      .catch(() => {
        setList([]);
      });
  };

  const markedDates = useMemo<CalendarSelectDate>(() => {
    let result: CalendarSelectDate = {};
    list?.forEach(li => {
      result[li?.USE_DATE?.split(' ')[0]] = {marked: true, dotColor: '#dc6f97'};
    });
    return result;
  }, [list]);

  const onMonthChange = ({year, month}: DayObject) => {
    setYM(String(year) + String(month));
  };

  useEffect((): void => {
    if (!isLogin) {
      dispatch('isModal', true);
      dispatch('loginRequired', true);
    }
  }, [dispatch, isLogin]);

  useEffect(getUseList, [isLogin?.USER_ID, YM]);

  return (
    <Container.Scroll>
      <TextPage.CommonText>
        {LANG === 'ko'
          ? `dono.LUNA를 사용한 날은 달력에 체크됩니다.

LUNA를 사용한 패턴과 당신의 변화를 느껴보세요.

LUNA는 당신의 건강을 지켜드립니다.

LUNA와 함께 새롭게 태어나세요.
        `
          : `Days used dono.LUNA are checked on the calendar.

Feel the change your state according to used LUNA patterns.

LUNA protects your health.

Be born again with LUNA.
        `}
      </TextPage.CommonText>

      <CustomCalendar
        monthFormat={LANG === 'ko' ? 'yyyy년 MM월' : 'yyyy. MM.'}
        enableSwipeMonths={false}
        onMonthChange={onMonthChange}
        markedDates={markedDates}
      />

      <List>
        {list?.map(item => (
          <LogItem key={item?.USE_ID} data={item} />
        ))}
      </List>
    </Container.Scroll>
  );
}

const CustomCalendar = styled(Calendar)`
  padding-bottom: 6px;
  border: 2px solid #f6e9f1;
  background-color: #f7ecf3;
`;
const List = styled(ScrollView)`
  width: 100%;
  margin: 5px 0;
  padding: 5px 0;
`;
