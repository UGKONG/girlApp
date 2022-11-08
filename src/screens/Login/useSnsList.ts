import {useMemo} from 'react';
import type {SnsLoginList} from '../../types';

export default function useSnsList(
  kakaoLogin: () => void,
  naverLogin: () => void,
  facebookLogin: () => void,
) {
  const memo = useMemo<SnsLoginList[]>(
    () => [
      {
        id: 1,
        name: 'KAKAO',
        img: require('../../../assets/images/loginIcon/kakao.png'),
        color: '#ebeb0f',
        onPress: kakaoLogin,
      },
      {
        id: 2,
        name: 'NAVER',
        img: require('../../../assets/images/loginIcon/naver.png'),
        color: '#099f09',
        onPress: naverLogin,
      },
      {
        id: 3,
        name: 'FACEBOOK',
        img: require('../../../assets/images/loginIcon/facebook.png'),
        color: '#3333aa',
        onPress: facebookLogin,
      },
    ],
    [kakaoLogin, naverLogin, facebookLogin],
  );

  return memo;
}
