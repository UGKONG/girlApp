/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useRef} from 'react';
import styled from 'styled-components/native';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';
import Slider from '../../components/Slider';
import {StrengthList, DurationList} from '../../types';

export default function 사용방법() {
  const strengthList = useRef<StrengthList>([1, 2, 3, 4, 5]);
  const durationList = useRef<DurationList>([5, 10, 15, 20, 25]);
  const [strength, setStrength] = useState<number>(strengthList?.current[1]);
  const [duration, setDuration] = useState<number>(durationList?.current[2]);

  // 리스트 Step, Min, Max
  type List = StrengthList | DurationList;
  const listStep = (list: List) => list[1] - list[0];
  const listFirst = (list: List) => list[0];
  const listLast = (list: List) => list[list?.length - 1];

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
          <SliderTextWrap>
            {strengthList?.current?.map((txt, i) => (
              <SliderText
                key={txt}
                count={strengthList?.current?.length}
                idx={i}
                active={Number(txt) === strength}
                ismargin={txt >= 10}>
                {txt}
              </SliderText>
            ))}
          </SliderTextWrap>
          <Slider
            step={listStep(strengthList?.current)}
            min={listFirst(strengthList?.current)}
            max={listLast(strengthList?.current)}
            color={'#e46b8b'}
            value={strength}
            disabled={true}
          />
        </SliderContainer>
      </Row>

      <TextPage.CommonText>{`
몸의 상태에 따라, 기분에 따라 에너지를 조절하면 느낌이 좋습니다. dono.LUNA의 에너지 조절은 일반 기계장치의 강도조절과 비슷한 느낌입니다만,  공명 에 너지는 강할 수록 효과가 좋은 것은 아닙니다. 사용 하시면서 자신에게 맞는 에너지 레벨을 찾아보세요
      `}</TextPage.CommonText>

      <Row>
        <RowTitle>타이머 (분)</RowTitle>
        <SliderContainer>
          <SliderTextWrap>
            {durationList?.current?.map((txt, i) => (
              <SliderText
                key={txt}
                count={durationList?.current?.length}
                idx={i}
                active={Number(txt) === duration}
                ismargin={txt >= 10}>
                {txt}
              </SliderText>
            ))}
          </SliderTextWrap>
          <Slider
            step={listStep(durationList?.current)}
            min={listFirst(durationList?.current)}
            max={listLast(durationList?.current)}
            color={'#e46b8b'}
            value={duration}
            disabled={true}
          />
        </SliderContainer>
      </Row>

      <TextPage.CommonText>{`
dono.LUNA는 작동 11분 후에 자동으로 꺼집니다. 11분이면 충분히 효과를 얻을 수 있기 때문입니다. 조금 더 dono.LUNA를 즐기고 싶다면 1뢰 정도 더 하는것도 좋습니다. (1일 2회면 충분합니다) dono.LUNA 2회때는 적당히 시간을 줄여서 사용하셔도 좋습니다.

휴대폰 케이스 설계와 같은 공법으로 생산하였으므로 속 살에 닿아도 전혀 문제 되지 않습니다.

필요시 얇은 속옷을 착용하고 그 위에 dono.LUNA를 사용할수도 있지만, 가급적 맨살 또는 매우 얇은 속을 추천합니다.

생리통이 매우 심하신 분 또는 빠른 효과를 보고싶다면 아랫배 1회, 그리고 좌우측 골반뼈에 dono.LUNA를 위치 시키십시요. 속 옷에 넣기 불편하면 잠시 5분이상 손으로 직접 대고 있어도 효과적입니다.

dono.LUNA는 조작 버튼 또는 LED를 구비하고 있지 않습니다. (속 옷 안에 넣어 아랫배에 살며시 올려 놓으면 사용준비 완료입니다.) 예민한 피부에 공명을 제외한 그 어떤 자극도 없게 하기위한 의공학적 설계를 했기 때문입니다. dono.LUNA는 App.에서 전기능 제어 됩니다. 배터리의 충전 상태를 비롯하여 자체 점검까지 사용자의 마음을 편하게 해드리기 위하여 최선을 다하였습니다.


      `}</TextPage.CommonText>
    </Container.Scroll>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  background-color: #f2bbd0;
  padding: 20px 10px 40px 0;
  border-radius: 10px;
  border: 2px solid #fff;
  position: relative;
`;
const RowTitle = styled.Text`
  width: 100px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 5px #df5e90;
  margin-right: 10px;
  white-space: nowrap;
`;
const SliderContainer = styled.View`
  position: relative;
  flex: 1;
`;
const SliderTextWrap = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0 11px;
  width: 100%;
  height: 24px;
  flex-direction: row;
  justify-content: space-between;
`;
type SlideTextProps = {
  count: number;
  idx: number;
  active: boolean;
  ismargin: boolean;
};
const SliderText = styled.Text`
  color: ${(x: SlideTextProps) => (x?.active ? '#e46b8b' : '#e46b8b66')};
  font-weight: ${(x: SlideTextProps) => (x?.active ? 700 : 400)};
  transform: translateX(
    ${(x: SlideTextProps) => (x?.ismargin ? '4px' : '0px')}
  );
`;
