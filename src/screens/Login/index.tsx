/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import {store} from '../../functions';
import Container from '../../components/Container';
import facebookIcon from '../../../assets/images/loginIcon/facebook.png';
import naverIcon from '../../../assets/images/loginIcon/naver.png';
import kakaoIcon from '../../../assets/images/loginIcon/kakao.png';
import googleIcon from '../../../assets/images/loginIcon/google.png';

export default function 로그인() {
  const dispatch = store(x => x?.setState);
  type SnsList = {id: string; img: string}[];
  const snsList = useMemo<SnsList>(
    () => [
      {id: 'facebook', img: facebookIcon},
      {id: 'naver', img: naverIcon},
      {id: 'kakao', img: kakaoIcon},
      {id: 'google', img: googleIcon},
    ],
    [],
  );

  const submit = useCallback(
    (platformName: string) => {
      if (!dispatch) return;
      console.log(platformName + ' Login');

      dispatch('isLogin', {
        USER_ID: 1,
        USER_NAME: '테스트',
        USER_ACCOUNT: 'test',
        PLATFORM: platformName,
      });
      dispatch('isModal', null);
    },
    [dispatch],
  );

  return (
    <Container.View style={{backgroundColor: '#E39CB8'}}>
      <IconWrap>
        {snsList?.map(item => (
          <Button key={item?.id} onPress={() => submit(item?.id)}>
            <Icon img={item?.img} />
          </Button>
        ))}
      </IconWrap>
    </Container.View>
  );
}

const IconWrap = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;
const Button = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  margin: 10px;
  border-radius: 60px;
  overflow: hidden;
`;
type IconProps = {img: string};
const Icon = styled.Image.attrs((x: IconProps) => ({
  source: x?.img,
}))`
  width: 100%;
  height: 100%;
`;
