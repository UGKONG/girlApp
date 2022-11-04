/* eslint-disable curly */
import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {NavigationContainerRefWithCurrent} from '@react-navigation/native';
import styled from 'styled-components/native';
import store from '../store';

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
};
export default function 사이드메뉴({navigationRef}: Props): JSX.Element {
  const dispatch = store(x => x?.setState);
  const isMenu = store<boolean>(x => x?.isMenu);
  type MenuList = {id: string; name: string}[];
  const menuList = useRef<MenuList>([
    {id: 'home', name: 'dono.LUNA 시작'},
    {id: 'question', name: '루나?'},
    {id: 'how', name: '사용방법'},
    {id: 'sns', name: 'SNS 둘러보기'},
    {id: 'days', name: 'LUNA days'},
    {id: 'log', name: '사용 로그'},
    {id: 'setting', name: '설정'},
  ]);
  const [isLocalMenu, setIsLocalMenu] = useState(isMenu);
  const duration = useRef<number>(200);
  const left = useRef(new Animated.Value(-250)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateOption = useMemo(
    () => ({
      duration: duration.current,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),
    [duration],
  );

  const sideMenuToggle = useCallback(() => {
    Animated.timing(left, {
      toValue: isMenu ? 0 : -250,
      ...animateOption,
    }).start();

    Animated.timing(opacity, {
      toValue: isMenu ? 1 : 0,
      ...animateOption,
    }).start(() => {
      setIsLocalMenu(isMenu);
    });
  }, [isMenu, left, opacity, animateOption]);

  useEffect(() => {
    sideMenuToggle();
    if (isMenu) setIsLocalMenu(true);
  }, [isMenu, sideMenuToggle]);

  const menuClick = (id: string): void => {
    navigationRef.navigate(id as never);
    dispatch('isMenu', false);
  };

  return (
    <>
      {isLocalMenu && <Background style={{opacity: opacity}} />}
      {isMenu && <ClickBackground onPress={() => dispatch('isMenu', false)} />}
      <Container style={{transform: [{translateX: left}]}}>
        <Description>{`공지 : 생리통에 관한 다양한 정보를 dono.LUNA 공식블로그에 지속적으로 업데이트 합니다. 
사용 방법 ‘S사NS용둘방러보법기’를 터치 하세요`}</Description>
        <Scroll>
          {menuList.current?.map(item => (
            <Menu key={item?.id} onPress={() => menuClick(item?.id)}>
              <MenuText>{item?.name}</MenuText>
            </Menu>
          ))}
        </Scroll>
      </Container>
    </>
  );
}

const Background = styled(Animated.View).attrs(() => ({
  activeOpacity: 1,
}))`
  width: 100%;
  height: 100%;
  background-color: #00000040;
  position: absolute;
  top: 0;
  left: 0;
`;
const ClickBackground = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;
const Container = styled(Animated.View)`
  position: absolute;
  top: 0;
  width: 250px;
  height: 100%;
  background: #fef6ff;
  padding: 10px;
  z-index: 50;
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
const MenuText = styled.Text`
  color: #555555;
`;
