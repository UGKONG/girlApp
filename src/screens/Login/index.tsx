/* eslint-disable prettier/prettier */
/* eslint-disable curly */
import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import {store} from '../../functions';
import Container from '../../components/Container';
import Toast from 'react-native-toast-message';

export default function 로그인() {
  const dispatch = store(x => x?.setState);
  type SnsList = {id: string; img: string}[];
  const snsList = useMemo<SnsList>(
    () => [
      {id: 'naver', img: require('../../../assets/images/loginIcon/naver.png')},
      {id: 'kakao', img: require('../../../assets/images/loginIcon/kakao.png')},
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

      Toast.show({
        type: 'success',
        text1: platformName + '로그인에 성공하였습니다.',
        text2: '테스트 회원님 반갑습니다.',
      });
    },
    [dispatch],
  );

  return (
    <Container.View>
      <Contents>
        <Title>LOGIN</Title>
        <IconWrap>
          {snsList?.map(item => (
            <Button key={item?.id} onPress={() => submit(item?.id)}>
              <Icon img={item?.img} />
            </Button>
          ))}
        </IconWrap>
      </Contents>
    </Container.View>
  );
}

const Title = styled.Text`
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #ee829f;
`;
const Contents = styled.View`
  width: 100%;
  height: 70%;
  align-items: center;
  justify-content: space-around;
`;
const IconWrap = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;
const Button = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  margin: 20px;
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
