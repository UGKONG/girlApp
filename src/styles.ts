import styled from 'styled-components/native';

/**
 * #8ba7c0
 * #b85c32
 */

export const Container = {
  View: styled.SafeAreaView`
    padding: 10px;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-start;
  `,
  Scroll: styled.ScrollView`
    padding: 10px;
  `,
};
type ButtonProps = {color?: string; none?: boolean};
export const Button = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  width: 100%;
  background-color: ${(x: ButtonProps) => x?.color ?? '#8ba7c0'};
  opacity: ${(x: ButtonProps) => (x?.none ? 0.4 : 1)};
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 6px;
`;
export const ButtonText = styled.Text`
  color: #fff;
  text-align: center;
`;
