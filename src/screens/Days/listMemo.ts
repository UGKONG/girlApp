/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable curly */
import {useMemo} from 'react';
import {useDate} from '../../functions';
import store from '../../store';
import type {CalendarSelectDate} from '../../types';
import type {DaysType} from './index';

export default function listMemo(
  currentList: Array<DaysType> = [],
): CalendarSelectDate {
  const isLogin = store(x => x?.isLogin);

  const list = useMemo(() => {
    if (!isLogin?.USER_ID) return {};
    const [mainColor, subColor, textColor] = ['#dc6f97', '#e687aa', '#fff'];
    const [selected, startingDay, endingDay] = [true, true, true];
    let result: CalendarSelectDate = {};

    currentList?.forEach(li => {
      const [start, end, id] = [li?.START_DATE, li?.END_DATE, li?.DAYS_ID];
      let startDate = new Date(start);
      result[start] = {id, selected, startingDay, color: mainColor};

      if (end) {
        let endDate = new Date(end);
        let calc = endDate?.getTime() - startDate?.getTime();
        calc = calc / 1000 / 24 / 60 / 60 - 1;
        result[end] = {id, selected, endingDay, color: mainColor};

        for (let i = 0; i < calc; i++) {
          startDate.setDate(startDate.getDate() + 1);
          result[useDate(startDate, 'date')] = {id, color: subColor, textColor};
        }
      }
    });
    return result;
  }, [isLogin?.USER_ID, currentList]);

  return list;
}
