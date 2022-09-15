/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React, {useCallback, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {store} from '../../functions';
import {LoginData} from '../../types';
import {Container, Button, ButtonText} from '../../styles';
import logoImage from '../../../assets/images/logo.png';
import text from '../../text.json';

export default function 로그인() {
  const {setState: dispatch, setting} = store(x => x);
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<LoginData>({id: '', pw: ''});

  const submit = useCallback(() => {
    if (!dispatch) return;
    dispatch('isLogin', {
      USER_ID: 1,
      USER_NAME: '테스트',
      USER_ACCOUNT: data.id,
    });
    dispatch('isModal', null);
  }, [data.id, dispatch]);

  const validate = useCallback(() => {
    if (!data.id) return idRef.current?.focus();
    if (!data.pw) return pwRef.current?.focus();

    submit();
  }, [data.id, data.pw, submit]);

  return (
    <Container.Scroll style={{height: '100%'}}>
      <Logo />

      <Form>
        <Input
          color={setting.color}
          placeholder={text.writeId[setting.lang]}
          keyboardType="email-address"
          ref={idRef}
          value={data.id}
          onChangeText={(val: string) => setData(prev => ({...prev, id: val}))}
          onSubmitEditing={() => pwRef.current?.focus()}
          autoFocus={true}
        />
        <Input
          color={setting.color}
          placeholder={text.writePw[setting.lang]}
          ref={pwRef}
          password={true}
          textContentType="password"
          multiline={false}
          value={data.pw}
          onChangeText={(val: string) => setData(prev => ({...prev, pw: val}))}
          returnKeyType="go"
          secureTextEntry={true}
          onSubmitEditing={() => validate()}
        />
        <Submit color={setting.color} onPress={validate}>
          <ButtonText>{text.login[setting.lang]}</ButtonText>
        </Submit>
      </Form>
    </Container.Scroll>
  );
}

const Logo = styled.Image.attrs(() => ({
  source: logoImage,
  resizeMode: 'contain',
}))`
  height: 100px;
  margin: 30% auto 100px;
`;
const Form = styled.View`
  width: 100%;
  flex: 1;
  padding: 10px 0;
`;
const Input = styled.TextInput.attrs(() => ({
  maxLength: 30,
}))`
  border: 1px solid ${(x: {color: string}) => x?.color ?? '#8ba7c0'}50;
  margin-bottom: 10px;
  border-radius: 6px;
  padding-left: 10px;
  padding-right: 10px;
`;
const Submit = styled(Button)`
  margin-top: 50px;
  background-color: ${(x: {color?: string}) => x?.color ?? '#8ba7c0'};
`;
