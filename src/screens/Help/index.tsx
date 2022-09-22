import React from 'react';
import Container from '../../components/Container';
import TextPage from '../../components/TextPage';

export default function 도움말() {
  return (
    <Container.Scroll>
      <TextPage.CommonText>
        {`dono.LUNA에 관한 도움될 말 적을 예정

사용방법 처럼 미리 작성 한 글을 스크롤 하며 보는 형태이므로 내용 정리되는 대로 드리겠습니다 ^^
`}
      </TextPage.CommonText>
    </Container.Scroll>
  );
}
