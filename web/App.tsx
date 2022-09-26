import React, {useEffect} from 'react';
import styled from 'styled-components';

export default function App(): JSX.Element {
  const kakaoLoginRequest = (): void => {
    console.log('로그인 요청');
    (window as any).Kakao.Auth.authorize({
      redirectUri: 'http://192.168.0.117:9000/',
      throughTalk: false,
      prompts: 'none',
    });

    return;
    (window as any).Kakao.Auth.login({
      success: () => {
        (window as any).Kakao.API.request({
          url: '/v2/user/me',
        })
          .then((res: any) => {
            console.log(res);
          })
          .catch(() => {
            console.log('kakaoAPI Errer!!!');
          });
      },
    });
  };

  const kakaoLoginSuccess = () => {
    // kakao.API.request({
    //   url: '/v2/user/me',
    //   success: (res: any) => {
    //     console.log(res);
    //     return;
    //     let authId = res?.id ?? null;
    //     let email = res?.kakao_account?.email ?? null;
    //     let name = res?.kakao_account?.profile?.nickname ?? null;
    //     let img = res?.kakao_account?.profile?.thumbnail_image_url ?? null;
    //     let platform = 'kakao';
    //     const sendData: string = JSON.stringify({
    //       authId,
    //       email,
    //       name,
    //       img,
    //       platform,
    //     });
    //     alert(sendData);
    //     (window as any)?.ReactNativeWebView?.postMessage(sendData);
    //     (window as any)?.ReactNativeWebView?.postMessage('kakao_login_success');
    //   },
    // });
    //   },
    // });
  };

  useEffect(() => {
    // kakaoLoginRequest();
  }, []);

  return (
    <Container>
      <Logo />
      <Form>
        <KakaoIcon
          url={require('../assets/images/loginIcon/kakao.png').default}
          onClick={kakaoLoginRequest}
        />
        <NaverIcon
          url={require('../assets/images/loginIcon/naver.png').default}
        />
        <Button
          onClick={() => {
            // kakaoLoginRequest();
            // return;
            // console.log((window as any)?.ReactNativeWebView);
            // (window as any)?.ReactNativeWebView?.postMessage('hello RN');
          }}>
          로그인 완료하기
        </Button>
      </Form>
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
