import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, BorderRadius, Shadows, BlurIntensity } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  variant?: 'default' | 'elevated' | 'flat' | 'outlined' | 'dark';
}

export function GlassCard({
  children,
  style,
  intensity = BlurIntensity.light,
  variant = 'default',
}: GlassCardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.card, styles.elevated];
      case 'flat':
        return [styles.card, styles.flat];
      case 'outlined':
        return [styles.card, styles.outlined];
      case 'dark':
        return [styles.card, styles.dark];
      default:
        return styles.card;
    }
  };

  const isDark = variant === 'dark';

  return (
    <View style={[getVariantStyle(), style]}>
      <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card, // 24px
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: Colors.border, // #E7EDF5
    ...Shadows.card,
  },
  elevated: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  flat: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  outlined: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  dark: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderColor: Colors.glassDarkBorder,
    ...Shadows.lg,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
