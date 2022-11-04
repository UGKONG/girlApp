import React, {useRef} from 'react';
import {Linking} from 'react-native';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';

export default function SNS둘러보기(): JSX.Element {
  type SnsBtnList = {name: string; top: number; left: number; url: string};
  const snsBtnList = useRef<SnsBtnList[]>([
    {
      name: 'naverBlog',
      top: 10,
      left: 88,
      url: 'https://blog.naver.com/donomedical',
    },
    {
      name: 'facebook',
      top: 10,
      left: 236,
      url: 'https://www.facebook.com/profile.php?id=100085282237689',
    },
    {
      name: 'instagram',
      top: 136,
      left: 276,
      url: 'https://www.instagram.com/dono.medical',
    },
    {
      name: 'youtube',
      top: 210,
      left: 170,
      url: 'https://www.youtube.com/channel/UChuWSXzGHqOghcSdLPeRXdQ',
    },
    {
      name: 'kakaoStory',
      top: 130,
      left: 57,
      url: 'https://pf.kakao.com/_xhxkdVxj',
    },
  ]);

  return (
    <Container.Scroll>
      <TextPage.CommonText>
        {`3년이 넘는 개발과 시험과정에서 dono.LUNA의 기술진 들은 생명이 잉태되는 자궁의 중요함과 신비로움에 대하여 경탄과 찬사가 이어졌습니다.

즉, 자궁의 건강을 챙기는 것은 생리진통의 경감 만을 위하는 것이 아닙니다. 이는 곧 폐경의 지연과 더불어 피부미용에도 깊은 연관이 있을뿐더러, 더 나아가 인류 의 진화가 이어지는 곳 이기도 합니다.

dono.LUNA 공식 블로그와 다양한 SNS채널에서는 자궁의 건강을 위한 다양한 정보를 지속적으로 업데이트 할 것입니다.

dono.LUNA와 함께 심리적, 정신적 그리고 사회적 안녕을 맞이하면 평온하고 건강하게 삶의 질이 향상 됩니다.

      `}
      </TextPage.CommonText>
      <ImageContainer>
        <TextPage.Image
          source={require('../../../assets/images/snsGroup.png')}
          width="280px"
          height="280px"
        />
        {snsBtnList?.current?.map(item => (
          <SnsBtn
            key={item?.name}
            onPress={() => Linking.openURL(item?.url)}
            style={{top: item?.top, left: item?.left}}
          />
        ))}
      </ImageContainer>
    </Container.Scroll>
  );
}

const ImageContainer = styled.View`
  width: 100%;
  position: relative;
  margin-bottom: 100px;
`;
const SnsBtn = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  position: absolute;
`;
