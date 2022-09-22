/* eslint-disable prettier/prettier */
import styled from 'styled-components/native';

export const CommonText = styled.Text`
  width: 100%;
  font-size: 15px;
  line-height: 24px;
  color: #333;
`;
export const HelloText = styled(CommonText)``;
export const StrongText = styled(CommonText)`
  font-size: 22px;
  font-weight: 600;
  color: #e87ea6;
  margin: 20px 0;
`;
type ImageProps = {width: string; height: string};
export const Image = styled.Image.attrs(() => ({
  resizeMode: 'contain',
}))`
  width: ${(x: ImageProps) => x?.width ?? '70%'};
  height: ${(x: ImageProps) => x?.height ?? '220px'};
  margin: 0 auto 20px;
`;
export const SubText = styled.Text`
  width: 100%;
  font-size: 13px;
  line-height: 16px;
  color: #555555;
`;

export default {
  CommonText,
  HelloText,
  StrongText,
  Image,
  SubText,
};
