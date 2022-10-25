/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable curly */
import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';
import {Calendar} from 'react-native-calendars';
import type {
  CalendarSelectDate,
  DateResponse,
  DateSaveForm,
  DayObject,
} from '../../types';
import {useDate} from '../../functions';
import store from '../../store';
import useAxios from '../../../hooks/useAxios';
import {iAxiosResponse} from '../../../hooks/useApiResponse';
import {Alert} from 'react-native';

export default function Days(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const isLogin = store(x => x?.isLogin);
  type Data = {start?: string; end?: string};
  const [list, setList] = useState<Array<Data>>([]);
  const [data, setData] = useState<Data>({start: undefined, end: undefined});
  const [YM, setYM] = useState<string>(
    useDate(undefined, 'date')?.replace('-', '')?.slice(0, 6),
  );

  const getDate = () => {
    if (!isLogin?.USER_ID || !YM) return;

    useAxios
      .get('/date', {
        params: {
          USER_ID: isLogin?.USER_ID,
          APP_PLATFORM: 'LUNA',
          YM,
        },
      })
      .then(({data: resData}: iAxiosResponse) => {
        if (!resData?.result) return;

        let pushArray = resData?.current?.map((x: DateResponse) => ({
          start: x?.START_DATE,
          end: x?.END_DATE,
        }));
        setList(prev => [...prev].concat(pushArray));
      });
  };

  const dateSave = (form: DateSaveForm) => {
    useAxios
      .post('/date', form)
      .then(() => {})
      .catch(() => {});
  };

  const dateDelete = () => {};

  const onDayPress = (day: DayObject): void => {
    let select = day?.dateString;

    // 기존에 있는지 여부 확인
    if (selectedDate[select]) {
      return Alert.alert('LUNA', '저장된 생리일을 제거하시겠습니까?', [
        {text: '취소'},
        {text: '삭제', onPress: () => dateDelete()},
      ]);
    }

    let start = data?.start;
    let end = data?.end;

    if (!start) return setData(prev => ({...prev, start: select}));
    if (start === select) return setData({start: undefined, end: undefined});
    if (end === select) return setData(prev => ({...prev, end: undefined}));

    setData(prev => ({...prev, end: select}));
  };

  const selectedDate = useMemo(() => {
    if (!isLogin?.USER_ID) return {};

    let start = data?.start;
    let end = data?.end;
    let selected: boolean = true;
    let startingDay: boolean = true;
    let endingDay: boolean = true;
    let color: string = '#dc6f97';
    let result: CalendarSelectDate = {
      [useDate(undefined, 'date')]: {textColor: color},
    };

    // 이미 불러온 데이터
    list?.forEach(li => {
      if (!li?.start || !li?.end) return;
      result[li?.start] = {selected, startingDay, color};
      result[li?.end] = {selected, endingDay, color};

      let prevStartDate = new Date(li?.start);
      let prevEndDate = new Date(li?.end);
      let calc = prevEndDate.getTime() - prevStartDate.getTime();
      calc = calc / 1000 / 24 / 60 / 60 - 1;

      for (let i = 0; i < calc; i++) {
        prevStartDate.setDate(prevStartDate.getDate() + 1);
        result[useDate(prevStartDate, 'date')] = {
          color: '#e687aa',
          textColor: '#fff',
        };
      }
    });

    if (!start) return result;
    result[start ?? ''] = {selected, startingDay, color};

    if (!end) return result;
    result[end ?? ''] = {selected, endingDay, color};

    let startDate: Date = new Date(start);
    let endDate: Date = new Date(end);
    let isReverse: boolean = endDate.getTime() - startDate.getTime() < 0;

    // 시작일보다 종료일이 빠르면..
    if (isReverse) {
      result[start] = {...result[start], startingDay: false, endingDay};
      result[end] = {...result[end], endingDay: false, startingDay};
      [start, end] = [end, start];
      startDate = new Date(start);
      endDate = new Date(end);
    }

    // 시작일과 종료일 사이 일자 추가
    let calcDate = new Date(start);
    let calc = endDate.getTime() - startDate.getTime();
    calc = calc / 1000 / 24 / 60 / 60 - 1;

    for (let i = 0; i < calc; i++) {
      calcDate.setDate(calcDate.getDate() + 1);
      result[useDate(calcDate, 'date')] = {color: '#e687aa', textColor: '#fff'};
    }

    let form: DateSaveForm = {
      USER_ID: isLogin?.USER_ID as number,
      APP_PLATFORM: 'LUNA',
      START_DATE: start,
      END_DATE: end,
    };
    dateSave(form);

    return result;
  }, [data, isLogin?.USER_ID, list]);

  const onMonthChange = ({year, month}: DayObject) => {
    setYM(String(year) + String(month));
  };

  useEffect((): void => {
    if (!isLogin) {
      dispatch('isModal', true);
      dispatch('loginRequired', true);
    }
  }, [dispatch, isLogin]);

  useEffect(getDate, [YM, isLogin?.USER_ID]);

  return (
    <Container.Scroll>
      <TextPage.CommonText>
        {`dono.LUNA는 LUNA day를 챙겨 드리고 싶습니다. LUNA day는 바쁜 생활 속에서 자칫 잊을 수 있는 생리 전 이틀을 말합니다. 그 날이 바로 dono.LUNA를 꼭 만나야 하는 날이니까요. 당신의 LUNA day를 위하여 시작일과 끝나는 날을 달력에 메모해 주시면 dono.LUNA가 LUNA day 를 챙겨 드릴 것입니다.
(자체 AI로 계산하므로 개인정보의 노출은 없습니다)
`}
      </TextPage.CommonText>

      <CustomCalendar
        monthFormat={'yyyy년 MM월'}
        enableSwipeMonths={false}
        markingType={'period'}
        onDayPress={onDayPress}
        markedDates={selectedDate}
        onMonthChange={onMonthChange}
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
