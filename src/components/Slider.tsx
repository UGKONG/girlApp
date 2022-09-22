/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import Slider from '@react-native-community/slider';

type Props = {
  min: number;
  max: number;
  step: number;
  color: string;
  value: number;
  disabled?: boolean;
  setValue?: (value: number) => void;
};
export default function CustomSlider({
  min,
  max,
  step,
  color,
  value,
  disabled = false,
  setValue,
}: Props) {
  return (
    <Slider
      style={{flex: 1, height: 30}}
      tapToSeek={true}
      step={step}
      minimumValue={min}
      maximumValue={max}
      minimumTrackTintColor={color}
      maximumTrackTintColor={color + 'dd'}
      thumbTintColor={color}
      value={value}
      onSlidingComplete={setValue}
      disabled={disabled}
    />
  );
}
