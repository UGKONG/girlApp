import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useRef} from 'react';
import styled from 'styled-components/native';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
};
export default function 로고메뉴({navigation}: Props) {
  type MenuBtnList = {id: string; name: string; top: number; left: number};
  const menuBtnList = useRef<MenuBtnList[]>([
    {id: 'question', name: '루나?', top: 154, left: -30},
    {id: 'how', name: '사용방법', top: 26, left: -30},
    {id: 'sns', name: 'SNS 둘러보기', top: 20, left: 184},
    {id: 'days', name: 'LUNA days', top: 116, left: 230},
    {id: 'log', name: '사용로그', top: 235, left: 70},
    {id: 'home', name: 'dono.LUNA', top: 210, left: 200},
  ]);
  return (
    <Container>
      <SymbolWeb />
      {menuBtnList.current?.map((item: MenuBtnList) => (
        <MenuBtn
          key={item?.id}
          style={{top: item?.top, left: item?.left}}
          onPress={() => navigation.navigate(item?.id)}
        />
      ))}
    </Container>
  );
}

const Container = styled.View`
  width: 320px;
  height: 350px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;
type SymbolWebReturn = {source: string; resizeMode: string};
const SymbolWeb = styled.Image.attrs(
  (): SymbolWebReturn => ({
    source: require('../../../assets/images/mainWeb.png'),
    resizeMode: 'contain',
  }),
)`
  width: 100%;
  max-width: 400px;
  height: 100%;
  margin-bottom: 20px;
`;
const MenuBtn = styled.TouchableOpacity`
  background-color: #00000000;
  position: absolute;
  width: 120px;
  height: 60px;
`;
