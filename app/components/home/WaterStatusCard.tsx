import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Clock, Gauge, ArrowRight } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
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

  const pressureBar = schedule?.currentPressureBar || 3.4;
  const status = schedule?.status || 'AVAILABLE';

  // SVG Circular progress math
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Pressure scale 0 to 5 bar
  const progress = Math.min(pressureBar / 5.0, 1.0);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <GlassCard style={styles.card} intensity={50} variant="elevated">
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.sectionHeader}>TODAY'S WATER SUPPLY</Text>
          <Text style={styles.cardTitle}>Current Water Status</Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <View style={styles.body}>
        <View style={styles.gaugeContainer}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(0, 91, 172, 0.12)"
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

        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <Clock size={18} color={Colors.secondary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Next Supply Countdown</Text>
              <Text style={styles.countdownText}>{countdown.formatted}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <Gauge size={18} color={Colors.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Scheduled Supply Slot</Text>
              <Text style={styles.slotText}>
                {schedule?.morningSlot.start} - {schedule?.morningSlot.end}
              </Text>
            </View>
          </View>
        </View>
      </View>

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
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  cardTitle: {
    ...Typography.title2,
    color: Colors.text,
    marginTop: 2,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
    ...Typography.title1,
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
    marginLeft: 10,
  },
  infoLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  countdownText: {
    ...Typography.title3,
    color: Colors.text,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  slotText: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  footerLinkText: {
    ...Typography.footnoteMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
});
