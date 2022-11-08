/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable curly */

import React, {useState} from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import store from '../../store';
import Container from '../../components/Container';
import Toast from 'react-native-toast-message';
import useSnsList from './useSnsList';
import {
  getProfile as getKakaoProfile,
  login,
} from '@react-native-seoul/kakao-login';
import type {GetProfileResponse} from '@react-native-seoul/naver-login';
import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import type {
  SnsLoginData,
  NaverLoginPlatformKey,
  User,
  SnsLoginList,
} from '../../types';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Checkbox} from 'react-native-paper';
import useAxios from '../../../hooks/useAxios';
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  Profile,
} from 'react-native-fbsdk-next';

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

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
};
export default function 로그인({navigation}: Props): JSX.Element {
  const dispatch = store(x => x?.setState);
  const possibleDeviceName = store(x => x?.possibleDeviceName);
  const LANG = store(x => x?.lang);
  const [isAutoLogin, setIsAutoLogin] = useState(true);

  // 최종 로그인
  const submit = ({snsPlatform, id, name}: SnsLoginData): void => {
    if (!dispatch) return;

    if (id === '' || name === '') {
      Toast.show({
        type: 'error',
        text1:
          snsPlatform +
          (LANG === 'ko'
            ? ' 계정으로 로그인을 시도하였습니다.'
            : ' Account Login Request.'),
        text2: LANG === 'ko' ? '로그인에 실패하였습니다.' : 'Login Fail',
      });
      return;
    }

    const userData: User = {
      AUTH_ID: id,
      USER_NAME: name,
      SNS_PLATFORM: snsPlatform,
      APP_PLATFORM: 'LUNA',
    };

    useAxios
      .post('/user/login', userData)
      .then(({data}) => {
        if (!data?.result) {
          return Toast.show({
            type: 'error',
            text1:
              snsPlatform +
              (LANG === 'ko'
                ? '계정으로 로그인을 시도하였습니다.'
                : 'Account Login Request.'),
            text2: LANG === 'ko' ? '로그인에 실패하였습니다.' : 'Login Fail',
          });
        }

        // 성공
        dispatch('isLogin', data?.current);
        AsyncStorage.setItem('isLogin', JSON.stringify(data?.current));

        Toast.show({
          type: 'success',
          text1:
            snsPlatform +
            (LANG === 'ko'
              ? '계정으로 로그인하였습니다.'
              : 'Account Login Success'),
          text2: name + (LANG === 'ko' ? '님 반갑습니다.' : ' Hello!!'),
        });
      })
      .catch(err => {
        console.log(err);
        // 실패
        dispatch('isLogin', null);
        AsyncStorage.removeItem('isLogin');

        Toast.show({
          type: 'error',
          text1:
            snsPlatform +
            (LANG === 'ko'
              ? '계정으로 로그인을 시도하였습니다.'
              : 'Account Login Request.'),
          text2: LANG === 'ko' ? '로그인에 실패하였습니다.' : 'Login Fail',
        });
      })
      .finally(() => {
        dispatch('isModal', false);
      });
  };

  // 카카오 회원정보 조회
  const getKakaoData = (): void => {
    getKakaoProfile().then((value: any): void | PromiseLike<void> => {
      const snsPlatform = 'KAKAO';
      const id: string = value?.id ?? '';
      const name: string = (value?.nickname as string) ?? '';

      let data: SnsLoginData = {
        appPlatform: possibleDeviceName,
        snsPlatform,
        id,
        name,
      };
      submit(data);
    });
  };

  // 네이버 회원정보 조회
  const getNaverData = (token: string): void => {
    getProfile(token).then((result: GetProfileResponse) => {
      const snsPlatform = 'NAVER';
      let data: SnsLoginData = {
        appPlatform: possibleDeviceName,
        snsPlatform,
        id: '',
        name: '',
      };

      if (result.message === 'success') {
        data = {
          ...data,
          id: result?.response?.id ?? '',
          name: result?.response?.name ?? '',
        };
      }

      submit(data);
    });
  };

  // 네이버 로그인
  const naverLogin = (): void => {
    NaverLogin.login(naverLoginPlatformKey, (err, token): void => {
      if (err || !token?.accessToken) return;
      getNaverData(token?.accessToken);
    });
  };

  // 카카오 로그인
  const kakaoLogin = (): void => {
    login()
      .then(getKakaoData)
      .catch(() => {});
  };

  // 페이스북 로그인
  const facebookLogin = (): void => {
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]).then(
      (result: any) => {
        if (result.isCancelled) return;
        AccessToken.getCurrentAccessToken().then(data => {
          if (!data) return;
          let token = data?.accessToken?.toString();
          if (!token) return;

          Profile.getCurrentProfile().then(profile => {
            if (!profile?.userID || !profile?.name) return;
            submit({
              appPlatform: possibleDeviceName,
              snsPlatform: 'FACEBOOK',
              id: profile?.userID,
              name: profile?.name,
            });
          });
        });
      },
      (error: Error) => {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  // 자동 로그인 체크
  const autoLoginCheck = (): void => setIsAutoLogin(prev => !prev);

  // SNS 로그인 리스트
  const snsList: Array<SnsLoginList> = useSnsList(
    kakaoLogin,
    naverLogin,
    facebookLogin,
  );

  return (
    <Container.View>
      <Contents>
        <Title>{LANG === 'ko' ? '로그인' : 'LOGIN'}</Title>
        <IconWrap>
          {snsList?.map(item => (
            <Button key={item?.id} color={item?.color} onPress={item?.onPress}>
              <Icon img={item?.img} />
            </Button>
          ))}
          {/* <LoginButton
            readPermissions={['public_profile']}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log(error);
                console.log('Login has error: ' + result?.error);
              } else if (result.isCancelled) {
                console.log('Login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  console.log(data?.accessToken.toString());
                  const processRequest = new GraphRequest(
                    '/me?fields=name,picture.type(large)',
                    undefined,
                    (error, result) => {
                      if (error) {
                        //Alert for the Error
                        console.log('Error fetching data: ' + error.toString());
                      } else {
                        //response alert
                        console.log(JSON.stringify(result));
                      }
                    },
                  );
                  // Start the graph request.
                  new GraphRequestManager().addRequest(processRequest).start();
                });
              }
            }}
            onLogoutFinished={() => {
              //Clear the state after logout
              console.log('logout');
            }}
          /> */}
        </IconWrap>
        <AutoLoginContainer>
          <Checkbox
            status={isAutoLogin ? 'checked' : 'unchecked'}
            color="#ee829f"
            onPress={autoLoginCheck}
          />
          <AutoLoginText onPress={autoLoginCheck}>
            {LANG === 'ko' ? '로그인유지' : 'Keep Login'}
          </AutoLoginText>
        </AutoLoginContainer>
      </Contents>
    </Container.View>
  );
}

const Title = styled.Text`
  font-size: 36px;
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
  color: #555555;
`;
