import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';

interface StatusBadgeProps {
  status:
    | 'AVAILABLE'
    | 'UNAVAILABLE'
    | 'MAINTENANCE'
    | 'SCHEDULED'
    | 'PENDING'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'RESOLVED'
    | 'CRITICAL'
    | 'HIGH'
    | 'MEDIUM'
    | 'LOW';
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
          border: 'rgba(34, 197, 94, 0.25)',
          text: Colors.success,
          dot: Colors.success,
          label: status === 'AVAILABLE' ? 'Supply Live' : status === 'RESOLVED' ? 'Resolved' : 'Low Priority',
        };
      case 'UNAVAILABLE':
      case 'CRITICAL':
        return {
          bg: Colors.dangerLight,
          border: 'rgba(239, 68, 68, 0.25)',
          text: Colors.error,
          dot: Colors.error,
          label: status === 'UNAVAILABLE' ? 'Supply Offline' : 'Critical',
        };
      case 'MAINTENANCE':
      case 'HIGH':
        return {
          bg: Colors.warningLight,
          border: 'rgba(245, 158, 11, 0.25)',
          text: '#D97706',
          dot: Colors.warning,
          label: status === 'MAINTENANCE' ? 'Maintenance' : 'High Priority',
        };
      case 'SCHEDULED':
      case 'IN_PROGRESS':
      case 'ASSIGNED':
      case 'MEDIUM':
      default:
        return {
          bg: Colors.infoLight,
          border: 'rgba(59, 130, 246, 0.25)',
          text: Colors.info,
          dot: Colors.info,
          label:
            status === 'SCHEDULED'
              ? 'Scheduled'
              : status === 'IN_PROGRESS'
              ? 'In Progress'
              : status === 'ASSIGNED'
              ? 'Assigned'
              : status,
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
    ...Typography.label,
    fontWeight: '700',
  },
  labelSm: {
    ...Typography.caption2,
    fontWeight: '700',
  },
});
