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
        {`dono.LUNA 는 특수한 음향 공명 기술을 통하여 자궁  근조직의 건강을 유도합니다. 자궁의 근조직이 활성화 되면 생리 진통은 자연스럽게 경감됩니다.

생리시작 이틀 전부터, 잠들기전 밤마다 dono.LUNA를 하면 생리 진통 경감에 도움이 됩니다.

생리 기간에 관계 없이 매일 dono.LUNA를 하게되면 생리 진통 경감에 크게 도움 됩니다. 
`}
      </TextPage.CommonText>

      <Row>
        <RowTitle>에너지</RowTitle>
        <SliderContainer>
          <SliderTouchHelpWrap>
            {powerList?.map((x, i) => (
              <SliderTouchHelp key={i}>
                <SliderText
                  key={x}
                  count={powerList?.length}
                  idx={i}
                  active={Number(x) === powerList[1]}
                  ismargin={x >= 10}>
                  {x}
                </SliderText>
              </SliderTouchHelp>
            ))}
          </SliderTouchHelpWrap>
          <Slider
            step={listStep(powerList)}
            min={listFirst(powerList)}
            max={listLast(powerList)}
            color={'#e46b8b'}
            value={remoteState?.timer ?? powerList[1]}
            disabled={true}
          />
        </SliderContainer>
      </Row>

      <TextPage.CommonText>{`
몸의 상태에 따라, 기분에 따라 에너지와 모드를 조절하면 느낌이 달라집니다. dono.LUNA의 에너지 조절은 일반 기계 장치의 강도 조절과 비슷한 느낌 입니다만,  공명 에너지는 강할수록 효과가 좋은 것은 아닙니다. 사용 하시면서 자신에게 맞는 에너지 레벨과 에너지 모드를 찾아보세요
      `}</TextPage.CommonText>

      <Row>
        <RowTitle>모드</RowTitle>
        <SliderContainer>
          <SliderTouchHelpWrap>
            {modeList?.map((x, i) => (
              <SliderTouchHelp key={i}>
                <SliderText
                  key={x}
                  count={modeList?.length}
                  idx={i}
                  active={Number(x) === modeList[2]}
                  ismargin={x >= 10}>
                  {x}
                </SliderText>
              </SliderTouchHelp>
            ))}
          </SliderTouchHelpWrap>
          <Slider
            step={listStep(modeList)}
            min={listFirst(modeList)}
            max={listLast(modeList)}
            color={'#e46b8b'}
            value={remoteState?.mode ?? modeList[2]}
            disabled={true}
          />
        </SliderContainer>
      </Row>

      <TextPage.CommonText>{`
dono.LUNA는 작동 11분 후에 자동으로 꺼집니다. 11분이면 충분히 효과를 얻을 수 있기 때문입니다. 조금 더 dono.LUNA를 즐기고 싶다면 1회 정도 더 하는 것도 좋습니다. (1일 2회 정도 충분) dono.LUNA 2회 때는 적당히 시간을 줄여서 사용하셔도 좋습니다.
      `}</TextPage.CommonText>

      <Row>
        <RowTitle>타이머 (분)</RowTitle>
        <SliderContainer>
          <SliderTouchHelpWrap>
            {timerList?.map((x, i) => (
              <SliderTouchHelp key={i}>
                <SliderText
                  key={x}
                  count={timerList?.length}
                  idx={i}
                  active={Number(x) === timerList[2]}
                  ismargin={x >= 10}>
                  {x}
                </SliderText>
              </SliderTouchHelp>
            ))}
          </SliderTouchHelpWrap>
          <Slider
            step={listStep(timerList)}
            min={listFirst(timerList)}
            max={listLast(timerList)}
            color={'#e46b8b'}
            value={remoteState?.timer ?? timerList[2]}
            disabled={true}
          />
        </SliderContainer>
      </Row>

      <TextPage.CommonText>{`
휴대폰 케이스 설계와 같은 공법으로 생산하였으므로 속 살에 닿아도 전혀 문제 되지 않습니다.

가급적 맨살 또는 매우 얇은 속옷 착용 후 사용을 추천합니다. (옷이 두꺼우면 에너지가 약해집니다)

생리통이 매우 심하신 분 또는 빠른 효과를 보고싶다면 아랫배 1회, 그리고 좌우측 골반뼈에 dono.LUNA를 위치 시키십시요. 속 옷에 넣기 불편하면 잠시 5분이상 손으로 직접 대고 있어도 효과적입니다.

dono.LUNA는 조작 버튼 또는 LED를 구비하고 있지 않습니다. (속 옷 안에 넣어 아랫배에 살며시 올려 놓으면 사용준비 완료입니다.) 예민한 피부에 공명을 제외한 그 어떤 자극도 없게 하기위한 의공학적 설계를 했기 때문입니다. dono.LUNA는 App.에서 전기능 제어 됩니다. 배터리의 충전 상태를 비롯하여 자체 점검까지 사용자의 마음을 편하게 해드리기 위하여 최선을 다하였습니다.
      `}</TextPage.CommonText>
    </Container.Scroll>
  );
}

const Row = styled(_Row)`
  background-color: #f1c3d5;
  padding: 20px 10px 40px;
  border-radius: 10px;
  border: 2px solid #fff;
  position: relative;
`;
const RowTitle = styled(_RowTitle)`
  color: #da6e89;
  white-space: nowrap;
`;
const SliderTouchHelpWrap = styled.View`
  position: absolute;
  width: 100%;
  top: 4px;
  left: 0;
  padding: 0 9px;
  flex-direction: row;
  justify-content: space-between;
`;
const SliderTouchHelp = styled.View`
  min-width: 15px;
  min-height: 15px;
  max-width: 15px;
  max-height: 15px;
  border-radius: 15px;
  background-color: #00000000;
  position: relative;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;
