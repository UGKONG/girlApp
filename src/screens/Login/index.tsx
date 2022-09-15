import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import {store} from '../../functions';
import {Container, mainColor, Button, ButtonText} from '../../styles';
import logoImage from '../../../assets/images/logo.png';

export default function 로그인() {
  const {setState: dispatch} = store(x => x);
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  type Data = {id: string; pw: string};
  const [data, setData] = useState<Data>({id: '', pw: ''});

  const submit = () => {
    dispatch('isLogin', {
      USER_ID: 1,
      USER_NAME: '테스트',
      USER_ACCOUNT: data.id,
    });
    dispatch('isModal', null);
  };

  const validate = () => {
    if (!data.id) return idRef.current?.focus();
    if (!data.pw) return pwRef.current?.focus();

    submit();
  };

  return (
    <Container.Scroll style={{height: '100%'}}>
      <Logo />

      <Form>
        <Input
          name="아이디"
          keyboardType="email-address"
          ref={idRef}
          value={data.id}
          onChangeText={(val: string) => setData(prev => ({...prev, id: val}))}
          onSubmitEditing={() => pwRef.current?.focus()}
          // autoFocus={true}
        />
        <Input
          name="비밀번호"
          ref={pwRef}
          password={true}
          textContentType={'password'}
          multiline={false}
          value={data.pw}
          onChangeText={(val: string) => setData(prev => ({...prev, pw: val}))}
          // returnKeyType="go"
          secureTextEntry={true}
          onSubmitEditing={() => validate()}
        />
        <Submit onPress={validate}>
          <ButtonText>LOGIN</ButtonText>
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
const Input = styled.TextInput.attrs((x: {name?: string}) => ({
  maxLength: 30,
  placeholder: (x.name ?? '로그인 정보') + '를 입력해주세요.',
}))`
  border: 1px solid ${mainColor}50;
  margin-bottom: 10px;
  border-radius: 6px;
  padding-left: 10px;
  padding-right: 10px;
`;
const Submit = styled(Button)`
  margin-top: 50px;
`;
