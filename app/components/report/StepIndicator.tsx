import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps = 4, labels }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.barRow}>
        {Array(totalSteps)
          .fill(0)
          .map((_, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;

            return (
              <View key={i} style={styles.stepItem}>
                <View
                  style={[
                    styles.bar,
                    isCompleted && styles.barCompleted,
                    isCurrent && styles.barCurrent,
                  ]}
                />
              </View>
            );
          })}
      </View>
      <Text style={styles.label}>
        Step {currentStep + 1} of {totalSteps}: {labels[currentStep] || ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  barRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stepItem: {
    flex: 1,
    marginHorizontal: 3,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 91, 172, 0.15)',
  },
  barCompleted: {
    backgroundColor: Colors.success,
  },
  barCurrent: {
    backgroundColor: Colors.primary,
  },
  label: {
    ...Typography.footnoteMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
