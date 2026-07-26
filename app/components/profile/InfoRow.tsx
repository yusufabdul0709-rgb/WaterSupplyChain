import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}

export function InfoRow({ icon, label, value, isLast = false }: InfoRowProps) {
  return (
    <View style={[styles.container, isLast && styles.noBorder]}>
      <View style={styles.left}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  label: {
    ...Typography.subhead,
    color: Colors.textSecondary,
  },
  value: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '600',
  },
});
