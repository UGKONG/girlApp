/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import styled from 'styled-components';

export default function App(): JSX.Element {
  const {Kakao, ReactNativeWebView}: any = window as any;
  type SendData = {id: number; name: string; platform: string};
  const [userData, setUserData] = useState<SendData | null>(null);
  const kakaoRedirectURL: string = 'http://192.168.45.236/';

  // 카카오 로그인 성공 (3)
  const kakaoLoginSuccess = (sendData: SendData): void => {
    setUserData(sendData);
    ReactNativeWebView?.postMessage(JSON.stringify(sendData));
  };

  // 유저 데이터 조회 (2)
  const getUserData = (): void => {
    alert('로그인 완료');

    Kakao.API.request({
      url: '/v2/user/me',
      success: (res: any): void => {
        let id: number = (res?.id as number) ?? 0;
        let name: string = res?.kakao_account?.profile?.nickname ?? '';
        let platform: string = 'kakao';

        const sendData: SendData = {id, name, platform};
        kakaoLoginSuccess(sendData);
      },
    });
  };

  // 카카오 로그인 셋팅 (1)
  const kakaoLoginInit = (): void => {
    const find = window.location.href?.indexOf('?code=') > -1;
    if (find) {
      getUserData();
      return;
    }

    Kakao.Auth.login({kakaoRedirectURL});
  };

  return (
    <Container>
      <Logo />
      <Form>
        <KakaoIcon
          url={require('../assets/images/loginIcon/kakao.png').default}
          onClick={kakaoLoginInit}
        />
        <NaverIcon
          url={require('../assets/images/loginIcon/naver.png').default}
        />
      </Form>
      <p style={{marginTop: 40}}>
        아이디: {userData?.id} / 이름: {userData?.name}
      </p>
    </Container>
  );
}

const Container = styled.main`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Logo = styled.img.attrs(() => ({
  src: require('../assets/images/mainSymbol.png').default,
}))`
  width: 150px;
  height: 150px;
  margin-bottom: 50px;
`;
const Form = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
type IconProps = {url: string};
const Icon = styled.div`
  width: 12vw;
  min-width: 50px;
  max-width: 60px;
  height: 12vw;
  min-height: 50px;
  max-height: 60px;
  border-radius: 50%;
  background-size: 102%;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 10px;
  cursor: pointer;
`;
const KakaoIcon = styled(Icon)`
  border: 2px solid #fae719;
  background-image: url(${(x: IconProps) => x?.url});
`;
const NaverIcon = styled(Icon)`
  border: 2px solid #23a23c;
  background-image: url(${(x: IconProps) => x?.url});
`;
const Button = styled.button``;
