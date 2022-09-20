/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {store} from '../../../functions';
import Container from '../../../components/Container';
import text from '../../../text.json';

export default function 앱_설정() {
  const {setState: dispatch, setting} = store(x => x);

  const langChange = (lang: string) => {
    dispatch('setting', {...setting, lang});
  };

  const colorChange = (color: string) => {
    dispatch('setting', {...setting, color});
  };

  return (
    <Container.Scroll>
      <Row.Container>
        <Row.Title>{text.lang[setting.lang]}</Row.Title>
        <Row.Contents>
          <ChoiceBtn
            onPress={() => langChange('ko')}
            style={{
              backgroundColor:
                setting.lang === 'ko' ? setting.color : 'transparent',
            }}>
            <Text style={{color: setting.lang === 'ko' ? '#fff' : '#000'}}>
              한국어
            </Text>
          </ChoiceBtn>
          <ChoiceBtn
            onPress={() => langChange('en')}
            style={{
              backgroundColor:
                setting.lang === 'en' ? setting.color : 'transparent',
            }}>
            <Text style={{color: setting.lang === 'en' ? '#fff' : '#000'}}>
              English
            </Text>
          </ChoiceBtn>
        </Row.Contents>
      </Row.Container>

      <Row.Container>
        <Row.Title>{text.theme[setting.lang]}</Row.Title>
        <Row.Contents>
          <ChoiceBtn
            onPress={() => colorChange('#8ba7c0')}
            style={{
              backgroundColor: '#8ba7c0',
              borderWidth: setting.color === '#8ba7c0' ? 1 : 0,
            }}
          />
          <ChoiceBtn
            onPress={() => colorChange('#b85c32')}
            style={{
              backgroundColor: '#b85c32',
              borderWidth: setting.color === '#b85c32' ? 1 : 0,
            }}
          />
        </Row.Contents>
      </Row.Container>
    </Container.Scroll>
  );
}

const Row = {
  Container: styled.View`
    padding: 10px;
    margin-bottom: 10px;
  `,
  Title: styled.Text`
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 6px;
  `,
  Contents: styled.View`
    width: 100%;
    height: 50px;
    border: 1px solid #ddd;
    flex-direction: row;
  `,
};
const ChoiceBtn = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  width: 50%;
  align-items: center;
  justify-content: center;
`;
