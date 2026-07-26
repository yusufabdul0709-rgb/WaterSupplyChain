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

  return (
    <View style={[getVariantStyle(), style]}>
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...Shadows.glass,
  },
  elevated: {
    backgroundColor: Colors.cardSolid,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...Shadows.lg,
  },
  flat: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  outlined: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
  },
  dark: {
    backgroundColor: 'rgba(7, 13, 25, 0.75)',
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  content: {
    padding: 16,
  },
});
