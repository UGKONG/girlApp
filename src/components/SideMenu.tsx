import React, {useCallback, useEffect, useRef} from 'react';
import {NavigationContainerRefWithCurrent} from '@react-navigation/native';
import styled from 'styled-components/native';
import {store} from '../functions';

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};
export default function 사이드메뉴({navigationRef}: Props) {
  const dispatch = store(x => x?.setState);
  const isMenu = store(x => x?.isMenu);
  type MenuList = {id: string; name: string}[];
  const menuList = useRef<MenuList>([
    {id: 'home', name: 'dono.LUNA 시작'},
    {id: 'question', name: '루나?'},
    {id: 'how', name: '사용방법'},
    {id: 'sns', name: 'SNS 둘러보기'},
    {id: 'days', name: 'LUNA days'},
    {id: 'log', name: '사용 로그'},
    {id: 'help', name: '도움말'},
    {id: 'setting', name: '설정'},
  ]);

  const onAnimate = useCallback((): void => {}, []);

  const offAnimate = useCallback((): void => {}, []);

  const onPress = (id: string): void => {
    navigationRef.navigate(id as never);
    dispatch('isMenu', false);
  };

  useEffect(() => {
    (isMenu ? onAnimate : offAnimate)();
  }, [isMenu, onAnimate, offAnimate]);

  return (
    <>
      {isMenu && <Background onPress={() => dispatch('isMenu', false)} />}
      <Container isMenu={isMenu}>
        <Description>
          공지 : 생리통에 좋은 음식 뿐만 아니라 다양한 정보를 dono.LUNA 공식
          블로그에 지속적으로 올리고 있습니다. 사용 방법 SNS 둘러보기를 활용해
          보세요
        </Description>
        <Scroll>
          {menuList.current?.map(item => (
            <Menu key={item?.id} onPress={() => onPress(item?.id)}>
              <MenuText>{item?.name}</MenuText>
            </Menu>
          ))}
        </Scroll>
      </Container>
    </>
  );
}

const Background = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 1,
}))`
  width: 100%;
  height: 100%;
  background-color: #00000040;
  position: absolute;
  top: 0;
  left: 0;
`;
type ContainerProps = {isMenu: boolean};
const Container = styled.SafeAreaView`
  position: absolute;
  left: ${(x: ContainerProps) => (x?.isMenu ? '0%' : '-60%')};
  top: 0;
  width: 60%;
  height: 100%;
  background: #eeeeee;
  padding: 10px;
  z-index: 50;
  transition: 0.4s;
`;
const Description = styled.Text`
  padding: 8px;
  margin-bottom: 10px;
  background-color: #e39cb8;
  color: #fff;
  border-radius: 6px;
`;
const Scroll = styled.ScrollView``;
const Menu = styled.TouchableOpacity`
  padding: 10px 5px;
  margin-bottom: 5px;
`;
const MenuText = styled.Text``;
