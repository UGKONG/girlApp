import React from 'react';
import styled from 'styled-components/native';

export default function CustomButton(props: any) {
  return (
    <Button {...props}>
      <ButtonText>{props?.children ?? 'Button'}</ButtonText>
    </Button>
  );
}

type ButtonProps = {readOnly: boolean};
const Button = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  width: 100%;
  border: 1px solid #f4e0e4;
  background-color: ${(x: ButtonProps) =>
    x?.readOnly ? '#dfcfd2' : '#ffedf0'};
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 6px;
`;
const ButtonText = styled.Text`
  color: #e087a8;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
`;
