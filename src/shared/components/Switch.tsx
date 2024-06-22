import {useTheme} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: () => void;
  trackColor: {false: string; true: string};
  thumbColor: string;
  icon: React.ElementType;
}

export const Switch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  trackColor,
  thumbColor,
  icon: Icon,
}) => {
  const {colors} = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, value]);

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  return (
    <TouchableOpacity onPress={onValueChange} style={styles.switchContainer}>
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [trackColor.false, trackColor.true],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.thumb,
          {left: thumbPosition, backgroundColor: thumbColor},
        ]}>
        <Icon color={colors.white} size={17} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 54,
    height: 30,
    borderRadius: 14,
    padding: 2,
  },
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
  },
  thumb: {
    width: 28,
    height: 28,
    padding: 10,
    borderRadius: 40,
    position: 'absolute',
    top: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
