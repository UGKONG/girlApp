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
        {`dono.LUNA는 적극적으로 당신의 건강을 생각하며 신뢰성 있는 LUNA day 산출을 위하여 당신의 도움이 필요합니다. 다름아닌, dono.LUNA의 사용 로그입니다. 혁신적인 생리통 경감과 자궁의 건강을 위해서는 당신의 생리 일정과 dono.LUNA 사용 패턴이 큰 단서가 됩니다. 

고객님의 정보를 토대로 산출된 내용을 하기 달력에 표기 하오니 적극적인 dono.LUNA사용에 동참해 주시기 바랍니다.
        `}
      </TextPage.CommonText>

      <CustomCalendar
        monthFormat={'yyyy년 MM월'}
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
