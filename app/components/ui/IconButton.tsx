import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Shadows } from '../../constants/theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  variant?: 'glass' | 'solid' | 'danger';
  style?: StyleProp<ViewStyle>;
}

export function IconButton({ icon, onPress, size = 44, variant = 'glass', style }: IconButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'solid':
        return styles.solid;
      case 'danger':
        return styles.danger;
      case 'glass':
      default:
        return styles.glass;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.button, { width: size, height: size, borderRadius: size / 2 }, getVariantStyle(), style]}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...Shadows.sm,
  },
  solid: {
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  danger: {
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.3)',
  },
});
