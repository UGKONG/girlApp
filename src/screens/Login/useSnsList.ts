import {useMemo} from 'react';
import type {SnsLoginList} from '../../types';

export default function useSnsList(
  kakaoLogin: () => void,
  naverLogin: () => void,
) {
  const memo = useMemo<SnsLoginList[]>(
    () => [
      {
        id: 1,
        name: 'Kakao',
        img: require('../../../assets/images/loginIcon/kakao.png'),
        color: '#ebeb0f',
        onPress: kakaoLogin,
      },
      {
        id: 2,
        name: 'Naver',
        img: require('../../../assets/images/loginIcon/naver.png'),
        color: '#099f09',
        onPress: naverLogin,
      },
    ],
    [kakaoLogin, naverLogin],
  );

  return memo;
}
