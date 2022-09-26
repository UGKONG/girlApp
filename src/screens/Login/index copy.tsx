/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable curly */
import React, {useCallback} from 'react';
import {store} from '../../functions';
import Toast from 'react-native-toast-message';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import styled from 'styled-components/native';
import {Alert} from 'react-native';

export default function 로그인(): JSX.Element {
  const dispatch = store(x => x?.setState);
  const runJs = `
    window.isNativeApp = true;
    const RNListener = () => {
      window.ReactNativeWebView.postMessage('hello');
    };
    window.removeEventListener('ReactNative', RNListener);
    window.addEventListener('ReactNative', RNListener);

    true; // note: this is required, or you'll sometimes get silent failures
  `;

  const submit = useCallback(
    (platformName: string): void => {
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

  const onMessage = ({nativeEvent: {data}}: WebViewMessageEvent) => {
    // console.log(data);
    Alert.alert(data);
  };

  return (
    <Web
      originWhitelist={['*']}
      scalesPageToFit={false}
      onMessage={onMessage}
      style={{marginTop: 30}}
      source={{
        uri: 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=0e0a649018457f1ff5a1d0704924598d&redirect_uri=http://192.168.0.117:9000/',
        // uri: 'http://192.168.0.117:9000/',
      }}
      // injectedJavaScript={runJs}
      javaScriptEnabled={true}
    />
  );
}

const Web = styled(WebView)`
  flex: 1;
  border: 1px solid #f00;
`;
