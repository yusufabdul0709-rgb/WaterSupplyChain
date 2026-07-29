import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Clock, Gauge, ArrowRight, Droplets, Activity, Layers } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import { WaterSchedule } from '../../data/mockWaterSchedule';
import { formatCountdown } from '../../utils/time';

interface WaterStatusCardProps {
  schedule?: WaterSchedule;
}

export function WaterStatusCard({ schedule }: WaterStatusCardProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(
    formatCountdown(schedule?.nextSupplyTime || new Date(Date.now() + 45 * 60 * 1000).toISOString())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(
        formatCountdown(schedule?.nextSupplyTime || new Date(Date.now() + 45 * 60 * 1000).toISOString())
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [schedule?.nextSupplyTime]);

  const pressureBar = schedule?.currentPressureBar ?? 3.4;
  const status = schedule?.status || 'AVAILABLE';
  const flowRate = '89.5 MLD';
  const waterAvailable = status === 'AVAILABLE' ? 'YES (High Pressure)' : 'SCHEDULED';

  // SVG Circular progress gauge math
  const size = 116;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(pressureBar / 5.0, 1.0);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <GlassCard style={styles.card} intensity={40} variant="elevated">
      {/* Top Card Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.sectionHeader}>TODAY'S WATER STATUS</Text>
          <Text style={styles.cardTitle}>Municipal Supply Live</Text>
        </View>
        <StatusBadge status={status} />
      </View>

      {/* Main Body: Circular Pressure Gauge + Key Telemetry */}
      <View style={styles.body}>
        <View style={styles.gaugeContainer}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.primary}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>
          <View style={styles.gaugeCenter}>
            <Text style={styles.gaugeValue}>{pressureBar.toFixed(1)}</Text>
            <Text style={styles.gaugeUnit}>BAR</Text>
          </View>
        </View>

        {/* Telemetry Metrics Column */}
        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <Clock size={16} color={Colors.secondary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Next Supply Countdown</Text>
              <Text style={styles.countdownText}>{countdown.formatted}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 10 }]}>
            <Droplets size={16} color={Colors.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Water Availability</Text>
              <Text style={styles.slotText}>{waterAvailable}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 10 }]}>
            <Activity size={16} color={Colors.success} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Current Grid Flow</Text>
              <Text style={styles.slotText}>{flowRate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Reservoir Source Detail */}
      <View style={styles.sourceBox}>
        <Layers size={14} color={Colors.primary} />
        <Text style={styles.sourceText} numberOfLines={1}>
          Source: {schedule?.reservoirSource || 'Simhachalam Reservoir & Yeleru Main Line'}
        </Text>
      </View>

      {/* Footer Link to detailed water supply page */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push('/water-supply')}
        style={styles.footerLink}
      >
        <Text style={styles.footerLinkText}>View Full Supply Schedule & Reservoir Source</Text>
        <ArrowRight size={16} color={Colors.primary} />
      </TouchableOpacity>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleGroup: {},
  sectionHeader: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  cardTitle: {
    ...Typography.sectionTitle,
    color: Colors.text,
    marginTop: 2,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  gaugeContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  gaugeValue: {
    ...Typography.display,
    color: Colors.primary,
    fontWeight: '800',
  },
  gaugeUnit: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginTop: -4,
  },
  infoGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextGroup: {
    marginLeft: 8,
  },
  infoLabel: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  countdownText: {
    ...Typography.cardTitle,
    color: Colors.text,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  slotText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  sourceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 91, 172, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    marginTop: 14,
  },
  sourceText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLinkText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
});
