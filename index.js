/* eslint-disable dot-notation */
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {LocaleConfig} from 'react-native-calendars';

// LANG: 'ko' | 'en'
const LANG = 'en';

const monthList = [
  LANG === 'ko' ? '1월' : 'January',
  LANG === 'ko' ? '2월' : 'February',
  LANG === 'ko' ? '3월' : 'March',
  LANG === 'ko' ? '4월' : 'April',
  LANG === 'ko' ? '5월' : 'May',
  LANG === 'ko' ? '6월' : 'June',
  LANG === 'ko' ? '7월' : 'July',
  LANG === 'ko' ? '8월' : 'August',
  LANG === 'ko' ? '9월' : 'September',
  LANG === 'ko' ? '10월' : 'October',
  LANG === 'ko' ? '11월' : 'November',
  LANG === 'ko' ? '12월' : 'December',
];
const dayList = [
  LANG === 'ko' ? '일요일' : 'Sunday',
  LANG === 'ko' ? '월요일' : 'Monday',
  LANG === 'ko' ? '화요일' : 'Tuesday',
  LANG === 'ko' ? '수요일' : 'Wednesday',
  LANG === 'ko' ? '목요일' : 'Thursday',
  LANG === 'ko' ? '금요일' : 'Friday',
  LANG === 'ko' ? '토요일' : 'Saturday',
];
const shortDayList = [
  LANG === 'ko' ? '일' : 'Sun',
  LANG === 'ko' ? '월' : 'Mon',
  LANG === 'ko' ? '화' : 'Tue',
  LANG === 'ko' ? '수' : 'Wed',
  LANG === 'ko' ? '목' : 'Thu',
  LANG === 'ko' ? '금' : 'Fri',
  LANG === 'ko' ? '토' : 'Sat',
];

LocaleConfig.locales['fr'] = {
  monthNames: monthList,
  monthNamesShort: monthList,
  dayNames: dayList,
  dayNamesShort: shortDayList,
  today: LANG === 'ko' ? '오늘' : 'Today',
};
LocaleConfig.defaultLocale = 'fr';

AppRegistry.registerComponent(appName, () => App);
