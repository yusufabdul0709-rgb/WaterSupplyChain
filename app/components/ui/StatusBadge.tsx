import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';

interface StatusBadgeProps {
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE' | 'SCHEDULED' | 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'AVAILABLE':
      case 'RESOLVED':
      case 'LOW':
        return {
          bg: Colors.successLight,
          border: 'rgba(0, 200, 83, 0.3)',
          text: Colors.success,
          dot: Colors.success,
          label: status === 'AVAILABLE' ? 'Water Supply Live' : status === 'RESOLVED' ? 'Resolved' : 'Low Priority',
        };
      case 'UNAVAILABLE':
      case 'CRITICAL':
        return {
          bg: Colors.dangerLight,
          border: 'rgba(229, 57, 53, 0.3)',
          text: Colors.danger,
          dot: Colors.danger,
          label: status === 'UNAVAILABLE' ? 'Supply Paused' : 'Critical',
        };
      case 'MAINTENANCE':
      case 'HIGH':
        return {
          bg: Colors.warningLight,
          border: 'rgba(255, 193, 7, 0.3)',
          text: '#D97706',
          dot: '#D97706',
          label: status === 'MAINTENANCE' ? 'Maintenance' : 'High Priority',
        };
      case 'SCHEDULED':
      case 'IN_PROGRESS':
      case 'ASSIGNED':
      case 'MEDIUM':
      default:
        return {
          bg: Colors.infoLight,
          border: 'rgba(0, 166, 214, 0.3)',
          text: Colors.secondary,
          dot: Colors.secondary,
          label: status === 'SCHEDULED' ? 'Next Supply Scheduled' : status === 'IN_PROGRESS' ? 'Work In Progress' : status === 'ASSIGNED' ? 'Engineer Assigned' : status,
        };
    }
  };

  const config = getBadgeConfig();
  const isSm = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.border }, isSm && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: config.dot }, isSm && styles.dotSm]} />
      <Text style={[styles.label, { color: config.text }, isSm && styles.labelSm]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotSm: {
    width: 5,
    height: 5,
    marginRight: 4,
  },
  label: {
    ...Typography.footnoteMedium,
    fontWeight: '600',
  },
  labelSm: {
    ...Typography.caption1,
    fontWeight: '600',
  },
});
