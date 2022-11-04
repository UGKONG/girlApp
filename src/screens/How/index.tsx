/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useRef} from 'react';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';
import Slider from '../../components/Slider';
import {modeList, powerList, timerList} from '../Home/index';
import {
  Row as _Row,
  RowTitle as _RowTitle,
  SliderContainer,
  SliderTextWrap,
  SliderText,
  listStep,
  listFirst,
  listLast,
} from '../Home';
import store from '../../store';

export default function 사용방법(): JSX.Element {
  const remoteState = store(x => x?.remoteState);

  return (
    <Container.Scroll>
      <TextPage.CommonText>
        {`
도노루나 앱을 켭니다
카톡 또는 네이버를 누르고 로그인 합니다
`}
      </TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how1.png')}
        width="100%"
        height="250px"
      />

      <TextPage.CommonText>{`
메뉴 아이콘(햄버거버튼)을 누릅니다.
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how2.png')}
        width="100%"
        height="400px"
      />

      <TextPage.CommonText>{`
설정을 누릅니다.
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how3.png')}
        width="100%"
        height="400px"
      />

      <TextPage.CommonText>{`
도노루나의 양쪽을 손으로 잡으세요.
(루나가 켜지는 소리 : 삐~삐~ )
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how4.png')}
        width="100%"
        height="250px"
      />

      <TextPage.CommonText>{`
‘검색’을 누릅니다.
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how5.png')}
        width="100%"
        height="600px"
      />

      <TextPage.CommonText>{`
검색 된 도노루나를 확인하고 누릅니다.
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how6.png')}
        width="100%"
        height="300px"
      />

      <TextPage.CommonText>{`
내장비 등록 또는 루나 연결을 위한 팝업창이 나옵니다 ‘연결’을 누르면 바로 연결되지만
‘내장비 등록’을 하면 이후에 루나 연결이 쉬워 집니다
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how7.png')}
        width="100%"
        height="250px"
      />

      <TextPage.CommonText>{`
도노루나의 이름을 입력합니다
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how8.png')}
        width="100%"
        height="250px"
      />

      <TextPage.CommonText>{`
Lovely LUNA라고 입력해 봤습니다~ 내장비에 등록된 Lovely LUNA를 확인하세요
여러개의 루나 등록이 가능합니다
dono.LUNA의 연결을 위하여 Lovely LUNA를 눌러봅니다
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how9.png')}
        width="100%"
        height="250px"
      />

      <TextPage.CommonText>{`
내장비 목록에서 제거하고 싶다면 ‘내장비 제거’누르시고 도노루나에 연결하려면 ‘연결’을 누릅니다.
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how10.png')}
        width="100%"
        height="250px"
      />

      <TextPage.CommonText>{`
연결된 장비에 표시된 lovely LUNA를 확인합니다 그리고 화면상단에 dono.LUNA를 누릅니다
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how11.png')}
        width="100%"
        height="300px"
      />

      <TextPage.CommonText>{`
'루나시작'을 누릅니다.
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how12.png')}
        width="100%"
        height="800px"
      />

      <TextPage.CommonText>{`
몸의 상태에 따라, 기분에 따라 에너지와 모드를 조절 해 보세요. dono.LUNA의 에너지는 강할수록 효과가 좋은 것은 아닙니다. 사용 하시면서 자신에게 맞는 에너지 레벨과 에너지 모드를 선택보세요
      `}</TextPage.CommonText>

      <TextPage.Image
        source={require('../../../assets/images/how13.png')}
        width="100%"
        height="250px"
      />

      <TextPage.CommonText>{`
dono.LUNA는 작동 11분 후에 자동으로 꺼집니다. 타이머의 선택은 루나 시작 전에 선택하여야 합니다

dono.LUNA는 표면 재질은 인체에 무해하므로 피부 바로 닿아도 좋습니다. 또는 얇은 속옷 착용 후 사용을 추천합니다.

생리통이 매우 심하신 분 또는 빠른 효과를 보고싶다면 아랫배 1회, 그리고 좌우측 골반뼈에 dono.LUNA를 사용합니다.

dono.LUNA는 당신의 건강과 함께 합니다.


      `}</TextPage.CommonText>
    </Container.Scroll>
  );
}
