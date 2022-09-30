/* eslint-disable curly */
import React, {useCallback, useState} from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import store from '../../store';
import Container from '../../components/Container';
import Toast from 'react-native-toast-message';
import useSnsList from './useSnsList';
import type {
  KakaoProfile,
  KakaoProfileNoneAgreement,
} from '@react-native-seoul/kakao-login';
import {
  getProfile as getKakaoProfile,
  login,
} from '@react-native-seoul/kakao-login';
import type {GetProfileResponse} from '@react-native-seoul/naver-login';
import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import type {SnsLoginData, NaverLoginPlatformKey, User} from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Checkbox} from 'react-native-paper';

const iosKeys: NaverLoginPlatformKey = {
  kConsumerKey: 'JNaVcW1KLIzF72YKwfXB',
  kConsumerSecret: '5ZcNfKqnP7',
  kServiceAppName: 'LUNA',
  kServiceAppUrlScheme: 'girlApp', // only for iOS
};
const androidKeys: NaverLoginPlatformKey = {
  kConsumerKey: 'JNaVcW1KLIzF72YKwfXB',
  kConsumerSecret: '5ZcNfKqnP7',
  kServiceAppName: 'LUNA',
};

const naverLoginPlatformKey = Platform.OS === 'android' ? androidKeys : iosKeys;

export default function 로그인(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const [isAutoLogin, setIsAutoLogin] = useState(true);

  // 최종 로그인
  const submit = useCallback(
    ({platform, id, name}: SnsLoginData): void => {
      if (!dispatch) return;
      if (id === '' || name === '') {
        Toast.show({
          type: 'error',
          text1: platform + '계정으로 로그인을 시도하였습니다.',
          text2: '로그인에 실패하였습니다.',
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: platform + '계정으로 로그인하였습니다.',
        text2: name + '님 반갑습니다.',
      });

      const userData: User = {
        USER_ID: id,
        USER_NAME: name,
        PLATFORM: platform,
      };

      dispatch('isModal', null);
      dispatch('isLogin', userData);

      if (isAutoLogin) {
        AsyncStorage.setItem('isLogin', JSON.stringify(userData));
      } else {
        AsyncStorage.removeItem('isLogin');
      }
    },
    [dispatch, isAutoLogin],
  );

  // 카카오 회원정보 조회
  const getKakaoData = useCallback((): void => {
    getKakaoProfile().then(
      (
        value: KakaoProfile | KakaoProfileNoneAgreement,
      ): void | PromiseLike<void> => {
        const platform = 'Kakao';
        submit({platform, id: value?.id ?? '', name: value?.nickname ?? ''});
      },
    );
  }, [submit]);

  // 카카오 로그인
  const kakaoLogin = useCallback((): void => {
    login().then(getKakaoData);
  }, [getKakaoData]);

  // 네이버 회원정보 조회
  const getNaverData = useCallback(
    (token: string): void => {
      getProfile(token).then((result: GetProfileResponse) => {
        const platform = 'Naver';
        let data: SnsLoginData = {platform, id: '', name: ''};

        if (result.message === 'success') {
          data = {
            ...data,
            id: result?.response?.id ?? '',
            name: result?.response?.name ?? '',
          };
        }

        submit(data);
      });
    },
    [submit],
  );

  // 네이버 로그인
  const naverLogin = useCallback((): void => {
    NaverLogin.login(naverLoginPlatformKey, (err, token): void => {
      if (err || !token?.accessToken) return;

      getNaverData(token?.accessToken);
    });
  }, [getNaverData]);

  // SNS 로그인 리스트
  const snsList = useSnsList(kakaoLogin, naverLogin);

  // 자동 로그인 체크
  const autoLoginCheck = () => {
    setIsAutoLogin(prev => !prev);
  };

  return (
    <Container.View>
      <Contents>
        <Title>LOGIN</Title>
        <IconWrap>
          {snsList?.map(item => (
            <Button key={item?.id} color={item?.color} onPress={item?.onPress}>
              <Icon img={item?.img} />
            </Button>
          ))}
        </IconWrap>
        <AutoLoginContainer>
          <Checkbox
            status={isAutoLogin ? 'checked' : 'unchecked'}
            color="#ee829f"
            onPress={autoLoginCheck}
          />
          <AutoLoginText onPress={autoLoginCheck}>로그인유지</AutoLoginText>
        </AutoLoginContainer>
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
type ButtonProps = {color: string};
const Button = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  width: 60px;
  height: 60px;
  margin: 20px;
  border-radius: 60px;
  overflow: hidden;
  border: 2px solid ${(x: ButtonProps) => x?.color};
  background-color: ${(x: ButtonProps) => x?.color};
`;
type IconProps = {img: string};
const Icon = styled.Image.attrs((x: IconProps) => ({
  source: x?.img,
  resizeMode: 'contain',
}))`
  width: 101%;
  height: 101%;
`;
const AutoLoginContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;
const AutoLoginText = styled.Text`
  font-size: 12px;
`;
