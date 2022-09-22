import React from 'react';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';

export default function 루나란() {
  return (
    <Container.Scroll>
      <TextPage.HelloText>What is dono.LUNA?</TextPage.HelloText>
      <TextPage.StrongText>How reduce menstrual cramps?</TextPage.StrongText>
      <TextPage.CommonText>{`
Does the womb want electrical stimulation? (TENS)
Does the womb want vibrational stimulation? (Vibrator)
Does the womb want thermal stimulation? (Heating)
      `}</TextPage.CommonText>
      <TextPage.Image source={require('../../../assets/images/desc1.png')} />
      <TextPage.Image source={require('../../../assets/images/desc2.png')} />
      <TextPage.CommonText>{`
dono.LUNA is .....
Pre-activation of the uterus separates the endometrium smoothly and neatly. Prostaglandins are secreted to coagulate the bleeding that occurs when the endometrium separates from the uterine wall and to control the pain associated with bleeding. However, in general, excessive secretion of prostaglandins causes secondary pain. VART stimulation relieves pain by harmonizing the blood coagulation and dissolution systems.
      `}</TextPage.CommonText>
      <TextPage.StrongText>
        Use it for 11 minutes to make it comfortable for uncomfortable!
      </TextPage.StrongText>
      <TextPage.Image
        source={require('../../../assets/images/desc3.png')}
        width="100%"
        height="400px"
      />
      <TextPage.StrongText>
        Key technology of patented Dono.LUNA
      </TextPage.StrongText>
      <TextPage.CommonText>{`
Chaos resonanc that muscle tissue likes
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
