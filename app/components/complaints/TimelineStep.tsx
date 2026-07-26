import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CheckCircle2, Clock, UserCheck, Wrench, CheckCircle } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';

interface TimelineStepProps {
  title: string;
  subtitle: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLast?: boolean;
}

export function TimelineStep({
  title,
  subtitle,
  timestamp,
  isCompleted,
  isCurrent,
  isLast = false,
}: TimelineStepProps) {
  const getIcon = () => {
    if (isCompleted) return <CheckCircle size={18} color={Colors.success} />;
    if (isCurrent) return <Clock size={18} color={Colors.primary} />;
    return <Clock size={18} color={Colors.textTertiary} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <View
          style={[
            styles.iconCircle,
            isCompleted && styles.completedCircle,
            isCurrent && styles.currentCircle,
          ]}
        >
          {getIcon()}
        </View>
        {!isLast && <View style={[styles.line, isCompleted && styles.completedLine]} />}
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, isCurrent && styles.currentTitle]}>{title}</Text>
          {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftColumn: {
    alignItems: 'center',
    marginRight: 14,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: Colors.successLight,
    borderColor: 'rgba(0, 200, 83, 0.4)',
  },
  currentCircle: {
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    borderColor: Colors.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.divider,
    marginVertical: 4,
  },
  completedLine: {
    backgroundColor: Colors.success,
  },
  rightColumn: {
    flex: 1,
    paddingTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  currentTitle: {
    color: Colors.primary,
    fontWeight: '700',
  },
  timestamp: {
    ...Typography.caption2,
    color: Colors.textTertiary,
  },
  subtitle: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
