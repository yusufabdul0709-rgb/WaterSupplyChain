import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Activity, ShieldCheck, Cpu } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';

interface NetworkHealthCardProps {
  totalNodes?: number;
  nrwLossPercent?: number;
  healthPercent?: number;
}

export function NetworkHealthCard({
  totalNodes = 15,
  nrwLossPercent = 14.8,
  healthPercent = 98.4,
}: NetworkHealthCardProps) {
  return (
    <GlassCard style={styles.card} intensity={40}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Cpu size={18} color={Colors.primary} />
          <Text style={styles.title}>Municipal Network Telemetry</Text>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>IoT LIVE</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{healthPercent}%</Text>
          <Text style={styles.statLabel}>Grid Health</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalNodes}</Text>
          <Text style={styles.statLabel}>Active Sensors</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: Colors.warning }]}>{nrwLossPercent}%</Text>
          <Text style={styles.statLabel}>NRW Water Loss</Text>
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
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.successLight,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 4,
  },
  liveText: {
    ...Typography.caption2,
    color: Colors.success,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.title3,
    color: Colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.divider,
  },
});
