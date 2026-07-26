import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Beaker, CheckCircle } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';

interface WaterQualityCardProps {
  wqi?: number;
  ph?: number;
  chlorine?: number;
  turbidity?: number;
}

export function WaterQualityCard({
  wqi = 96,
  ph = 7.3,
  chlorine = 0.8,
  turbidity = 0.4,
}: WaterQualityCardProps) {
  return (
    <GlassCard style={styles.card} intensity={40}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Beaker size={18} color={Colors.secondary} />
          <Text style={styles.title}>Water Quality Monitoring</Text>
        </View>
        <View style={styles.qualityPill}>
          <CheckCircle size={12} color={Colors.success} style={{ marginRight: 4 }} />
          <Text style={styles.qualityText}>POTABLE / SAFE</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Water Quality Index</Text>
          <Text style={styles.metricValue}>{wqi}/100</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${wqi}%` }]} />
          </View>
        </View>

        <View style={styles.rowMetrics}>
          <View style={styles.subMetric}>
            <Text style={styles.subMetricLabel}>pH Balance</Text>
            <Text style={styles.subMetricValue}>{ph} pH</Text>
          </View>
          <View style={styles.subMetric}>
            <Text style={styles.subMetricLabel}>Chlorine</Text>
            <Text style={styles.subMetricValue}>{chlorine} ppm</Text>
          </View>
          <View style={styles.subMetric}>
            <Text style={styles.subMetricLabel}>Turbidity</Text>
            <Text style={styles.subMetricValue}>{turbidity} NTU</Text>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...Typography.headline,
    color: Colors.text,
    marginLeft: 8,
    fontSize: 15,
  },
  qualityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.successLight,
  },
  qualityText: {
    ...Typography.caption2,
    color: Colors.success,
    fontWeight: '700',
  },
  metricsGrid: {},
  metricItem: {
    marginBottom: 12,
  },
  metricLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  metricValue: {
    ...Typography.title3,
    color: Colors.primary,
    fontWeight: '700',
    marginVertical: 2,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  rowMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  subMetric: {
    alignItems: 'center',
  },
  subMetricLabel: {
    ...Typography.caption2,
    color: Colors.textTertiary,
  },
  subMetricValue: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
});
