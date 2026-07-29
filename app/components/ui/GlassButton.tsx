import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, StyleProp, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Shadows, Typography } from '../../constants/theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function GlassButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: GlassButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        disabled={disabled || loading}
        style={[styles.container, disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              {icon}
              <Text style={[styles.primaryText, icon ? { marginLeft: 8 } : null, textStyle]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { container: styles.secondaryContainer, text: styles.secondaryText };
      case 'outline':
        return { container: styles.outlineContainer, text: styles.outlineText };
      case 'danger':
        return { container: styles.dangerContainer, text: styles.dangerText };
      case 'ghost':
      default:
        return { container: styles.ghostContainer, text: styles.ghostText };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.container, vStyles.container, disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'danger' ? Colors.danger : Colors.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[vStyles.text, icon ? { marginLeft: 8 } : null, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.button, // 18px
    overflow: 'hidden',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    ...Shadows.sm,
  },
  primaryText: {
    ...Typography.bodyMedium,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  secondaryContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  secondaryText: {
    ...Typography.bodyMedium,
    color: Colors.secondary,
    fontWeight: '700',
  },
  outlineContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  outlineText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  dangerContainer: {
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  dangerText: {
    ...Typography.bodyMedium,
    color: Colors.danger,
    fontWeight: '700',
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  ghostText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
