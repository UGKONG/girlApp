import React from 'react';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';
import store from '../../store';

export default function 루나란(): JSX.Element {
  const LANG = store<'ko' | 'en'>(x => x?.lang);

  return (
    <Container.Scroll>
      <TextPage.HelloText>
        {LANG === 'ko'
          ? `dono.LUNA는 바이오공명으로 자궁 근조직의 건강을 도와줍니다. 자궁의 근조직이 활성화 되면 생리통은 완화됩니다.`
          : `dono.LUNA supports the health of womb muscle tissue through Bio-Resonance. When the womb muscle tissue is activated, period pain are relieved.`}
      </TextPage.HelloText>
      <TextPage.CommonText>
        {LANG === 'ko'
          ? `
생리 시작 이틀 전부터, dono.LUNA를 권장합니다.

빠른 효과를 원하시면 dono.LUNA를 매일 만나보세요.
`
          : `
Two days before the onset of menstruation, dono.LU- NA is recommended.
`}
      </TextPage.CommonText>
      <TextPage.StrongText>
        {LANG === 'ko'
          ? '어떻게 하면 생리통을 줄일수 있을까?'
          : 'How reduce menstrual cramps?'}
      </TextPage.StrongText>

      <TextPage.CommonText>
        {LANG === 'ko'
          ? `자궁은 저주파 (전기)자극을 좋아할까? (TENS) 
자궁은 진동모터 자극을 좋아할까? (Vibrator) 
자궁은 온열 자극을 좋아할까? (Heating)

      `
          : `Does the womb want electrical stimulation? (TENS) 
Does the womb want vibrational stimulation? (Vibrator) 
Does the womb want thermal stimulation? (Heating)
      `}
      </TextPage.CommonText>

      <TextPage.Image source={require('../../../assets/images/desc1.png')} />
      <TextPage.Image source={require('../../../assets/images/desc2.png')} />

      <TextPage.CommonText>
        {LANG === 'ko'
          ? `dono.LUNA 는.....
자궁의 사전 활성화로 자궁내막이 매끄럽고 깔끔하게 분리됩니다. 프로스타글란딘은 자궁내막이 자궁벽에서 분리될 때 발생하는 출혈을 응고시킬뿐만아니라 통증을 조절하기 위해 분비됩니다. 그러나 보통의 경우 프로스타 글란딘은 과도하게 분비되어 2 차 통증을 유발합니다. dono.LUNA는 혈액응고와 혈액용해 계통의 조화를 유도하여 통증 완화에 도움을 줍니다.
`
          : `dono.LUNA is.....
Pre-activation of the uterus separates the endometrium smoothly and neatly. Prostaglandins are secreted to con- trol pain and to clot the bleeding that occurs when the endometrium separates from the uterine wall. However, in most cases, excessive secretion of prostaglandins causes secondary pain. dono.LUNA helps relieve pain by inducing adjustment of the blood clotting and blood dissolution systems.
`}
      </TextPage.CommonText>

      <TextPage.StrongText style={{textAlign: 'center'}}>
        {LANG === 'ko'
          ? '11분 사용으로 편안해 집니다.'
          : 'After 11 minutes of use, you will feel comfortable.'}
      </TextPage.StrongText>

      <TextPage.Image
        source={
          LANG === 'ko'
            ? require('../../../assets/images/desc3.png')
            : require('../../../assets/images/desc3-en.png')
        }
        width="100%"
        height="400px"
      />

      <TextPage.StrongText>
        Key technology of patented Dono.LUNA
      </TextPage.StrongText>

      <TextPage.CommonText>{`Chaos resonance that muscle tissue likes Womb stabilization program
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
