import React from 'react';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';

export default function 루나란(): JSX.Element {
  return (
    <Container.Scroll>
      <TextPage.HelloText>
        어떻게 하면 생리통을 줄일수 있을까?
      </TextPage.HelloText>
      <TextPage.CommonText>{`
자궁은 저주파 (전기)자극을 좋아할까? (TENS)
자궁은 진동모터 자극을 좋아할까? (Vibrator)
자궁은 온열 자극을 좋아할까? (Heating)
      `}</TextPage.CommonText>

      <TextPage.Image source={require('../../../assets/images/desc1.png')} />
      <TextPage.Image source={require('../../../assets/images/desc2.png')} />

      <TextPage.StrongText>
        자궁은 자연스러운 자극을 좋아할지도 몰라!!
      </TextPage.StrongText>

      <TextPage.CommonText>{`
dono.LUNA 는.....
자궁의 사전 활성화로 자궁내막이 매끄럽고 깔끔하게 분리됩니다. 프로스타글란딘은 자궁내막이 자궁벽에서 분리될 때 발생하는 출혈을 응고시킬뿐만아니라 통증을 조절하기 위해 분비됩니다. 그러나 보통의 경우 프로스타 글란딘은 과도하게 분비되어 2 차 통증을 유발합니다. dono.LUNA는 혈액응고와 혈액용해 계통의 조화를 유도하여 통증 완화에 도움을 줍니다.
      `}</TextPage.CommonText>

      <TextPage.StrongText style={{textAlign: 'center'}}>
        11분 사용으로 편안해 집니다.
      </TextPage.StrongText>

      <TextPage.Image
        source={require('../../../assets/images/desc3.png')}
        width="100%"
        height="400px"
      />

      <TextPage.StrongText>
        Key technology of patented Dono.LUNA
      </TextPage.StrongText>

      <TextPage.CommonText>{`Chaos resonanc that muscle tissue likes
uterine stabilization program
Vibrating urticaria prevention system
Tissue and blood vessel strengthening program
      `}</TextPage.CommonText>
      <TextPage.SubText>{`
10-2016-0088154, 10-2020-0038889, 10-2020-0093761, 10-2019-0054643
10-2020-0162406, 10-2021-0192069, 10-2021-0154352, KR-2020 / 010019
      `}</TextPage.SubText>
    </Container.Scroll>
  );
}
