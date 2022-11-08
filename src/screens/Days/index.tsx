/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable curly */
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Calendar, DateData} from 'react-native-calendars';
import Toast from 'react-native-toast-message';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';
import {useDate} from '../../functions';
import store from '../../store';
import useAxios from '../../../hooks/useAxios';
import {iAxiosResponse} from '../../../hooks/useApiResponse';
import {Alert} from 'react-native';
import listMemo from './listMemo';
import type {AppPlatform, DayObject, CalendarSelectDate} from '../../types';
import ArrowIcon from 'react-native-vector-icons/AntDesign';

export interface DaysType {
  USER_ID: number | null | undefined;
  APP_PLATFORM: AppPlatform | null | undefined;
  DAYS_ID: number | null | undefined;
  START_DATE: string;
  END_DATE: string | null | undefined;
  CREATE_DATE: string | null | undefined;
}

export default function Days(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const isLogin = store(x => x?.isLogin);
  const LANG = store<'ko' | 'en'>(x => x?.lang);
  const [currentList, setCurrentList] = useState<DaysType[]>([]);
  const [YM, setYM] = useState<string>(
    useDate(undefined, 'date')?.replace('-', '')?.slice(0, 6),
  );
  const list: CalendarSelectDate = listMemo(currentList);

  // 날짜 조회
  const getDays = () => {
    if (!isLogin?.USER_ID || !YM) return;
    const params = {USER_ID: isLogin?.USER_ID, APP_PLATFORM: 'LUNA', YM};

    useAxios.get('/days', {params}).then(({data}: iAxiosResponse) => {
      if (!data?.result) return setCurrentList([]);
      setCurrentList(data?.current);
    });
  };

  // 날짜 추가 (시작일)
  const datePost = (START_DATE: string) => {
    if (!isLogin?.USER_ID) return;
    let form = {USER_ID: isLogin?.USER_ID, APP_PLATFORM: 'LUNA', START_DATE};
    useAxios
      .post('/days', form)
      .then(() => getDays())
      .catch(() => {});
  };

  // 종료일 변경
  const datePut = (DAYS_ID: number, END_DATE: string | null) => {
    let form = {
      USER_ID: isLogin?.USER_ID,
      APP_PLATFORM: 'LUNA',
      DAYS_ID,
      END_DATE,
    };
    useAxios
      .put('/days', form)
      .then(() => getDays())
      .catch(() => {});
  };

  // 날짜 삭제
  const dateDelete = (DAYS_ID: number) => {
    if (!isLogin?.USER_ID || !DAYS_ID) return;

    let form = {USER_ID: isLogin?.USER_ID, APP_PLATFORM: 'LUNA', DAYS_ID};
    useAxios
      .delete('/days', {params: form})
      .then(() => {
        Toast.show({text1: LANG === 'ko' ? '삭제되었습니다.' : 'Deleted.'});
        getDays();
      })
      .catch(() => {});
  };

  // 날짜 선택 시
  const clickDate = ({dateString: clickedDate}: DateData): void => {
    let find = list[clickedDate];
    let prevValidate: boolean = true;
    let nextValidate: boolean = true;

    if (find && !find?.today) {
      let optionBtn = {
        text: LANG === 'ko' ? '종료일 변경' : 'Change End Date',
        onPress: () => datePut(find?.id, null),
      };
      let buttons = [
        {text: LANG === 'ko' ? '취소' : 'Cancel'},
        {
          text: LANG === 'ko' ? '삭제' : 'Delete',
          onPress: () => dateDelete(find?.id),
        },
      ];
      if (!find?.startingDay) buttons.unshift(optionBtn);
      return Alert.alert(
        'LUNA',
        LANG === 'ko'
          ? '저장된 생리일을 제거하시겠습니까?'
          : 'Are you sure you want to delete it?',
        buttons,
        {
          cancelable: true,
        },
      );
    }

    let keys: Array<string> = [];
    currentList?.forEach(x => {
      if (x?.START_DATE) keys.push(x?.START_DATE);
      if (x?.END_DATE) keys.push(x?.END_DATE);
    });
    keys.push(clickedDate);
    keys?.sort((a, b) => {
      return Number(a?.replace(/-/g, '')) - Number(b?.replace(/-/g, ''));
    });

    let idx: number = keys?.indexOf(clickedDate);
    let prevDate: DaysType | undefined = currentList?.find(
      x => x?.END_DATE === keys[idx - 1] || x?.START_DATE === keys[idx - 1],
    );
    let nextDate: DaysType | undefined = currentList?.find(
      x => x?.START_DATE === keys[idx + 1] || x?.END_DATE === keys[idx + 1],
    );

    // 종료일이 입력되지 않음.
    if (
      (prevDate?.END_DATE === null && nextDate?.START_DATE) ||
      (prevDate?.END_DATE === null && !nextDate)
    ) {
      return datePut(prevDate?.DAYS_ID as number, clickedDate);
    }

    // 사이에 남은 일수가 1일 밖에 없을 때.
    if (nextDate && nextDate?.START_DATE) {
      let clickedDateObj = new Date(clickedDate);
      let nextStartDateObj = new Date(nextDate?.START_DATE);
      let calc = nextStartDateObj?.getTime() - clickedDateObj?.getTime();
      calc = calc / 1000 / 24 / 60 / 60;
      if (calc <= 1) nextValidate = false;
    }

    if (!nextValidate) {
      return Toast.show({
        type: 'error',
        text1:
          LANG === 'ko'
            ? '해당일에 지정할 수 없습니다.'
            : 'Cannot be selected date.',
      });
    }

    // 시작일 추가
    datePost(clickedDate);
  };

  // 월 변경 시
  const changeMonth = ({year, month}: DayObject) => {
    setYM(String(year) + String(month < 10 ? '0' + month : month));
  };

  useEffect((): void => {
    if (!isLogin) {
      dispatch('isModal', true);
      dispatch('loginRequired', true);
    }
  }, [dispatch, isLogin]);

  useEffect(getDays, [YM, isLogin?.USER_ID]);

  return (
    <Container.Scroll>
      <TextPage.CommonText>
        {LANG === 'ko'
          ? `LUNA Day ?

생리 시작 이틀 전 부터를 LUNA Day라고 합니다.

LUNA Day는 dono.LUNA를 만나는 날입니다.

생리 시작과 끝나는 날을 달력에 체크하면 LUNA Day 를 알려드립니다. (알람~)
`
          : `LUNA Day ?
          
The two days before menstruation is called LUNA Day.

LUNA Day is the day you meet dono.LUNA.

If you record the calendar for the start and end days of menstruation, you will be notified of LUNA Day. (Alarm~)
`}
      </TextPage.CommonText>

      <CustomCalendar
        monthFormat={'yyyy년 MM월'}
        enableSwipeMonths={true}
        markingType={'period'}
        onDayPress={clickDate}
        renderArrow={dir => (
          <ArrowIcon name={'arrow' + dir} color="#ea8aaf" size={26} />
        )}
        markedDates={{
          [useDate(undefined, 'date')]: {textColor: '#dc6f97', today: true},
          ...list,
        }}
        onMonthChange={changeMonth}
        hideExtraDays={true}
      />

      <Tip>
        {LANG === 'ko'
          ? `알림
다음 LUNA day 는 10월 15일로 예상됩니다. 건강한 삶을 위하여 14일 부터는 잊지 말고 dono.LUNA 하세요`
          : `Notice
The next LUNA day is expected to be Octo- ber 15th. For a healthy life, do not forget to meet dono.LUNA from the 14th.`}
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
  margin-bottom: 50px;
`;
const CustomCalendar = styled(Calendar)`
  padding-bottom: 6px;
  border: 2px solid #f6e9f1;
  background-color: #f7ecf3;
`;
