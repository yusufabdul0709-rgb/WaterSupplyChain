import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Gauge, Droplet, ShieldCheck, MapPin } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography, Spacing } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuthStore } from '../store/authStore';
import { useWaterStatus } from '../hooks/useWaterStatus';
import { formatCountdown } from '../utils/time';

export default function WaterSupplyDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { schedule } = useWaterStatus(user?.sectorId || 'SEC_MVP');

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

  // SVG Gauge Math
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(pressureBar / 5.0, 1.0);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Supply Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Status Hero Card */}
        <GlassCard style={styles.card} intensity={50} variant="elevated">
          <View style={styles.heroHeader}>
            <StatusBadge status={status} />
            <Text style={styles.wardTag}>
              {user?.wardNumber || 'Ward 42'} · {user?.sectorName || 'MVP Colony'}
            </Text>
          </View>

          <View style={styles.gaugeSection}>
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
              <Text style={styles.pressureValue}>{pressureBar.toFixed(1)}</Text>
              <Text style={styles.pressureUnit}>BAR PRESSURE</Text>
              <Text style={styles.statusLabel}>OPTIMAL FLOW</Text>
            </View>
          </View>

          <View style={styles.countdownBox}>
            <Clock size={20} color={Colors.secondary} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.cdLabel}>Next Scheduled Supply In</Text>
              <Text style={styles.cdTime}>{countdown.formatted}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Today's Supply Schedule Slots */}
        <GlassCard style={styles.card} intensity={45}>
          <Text style={styles.sectionTitle}>TODAY'S SUPPLY SCHEDULE SLOTS</Text>

          <View style={styles.slotRow}>
            <View style={styles.slotIconBox}>
              <Droplet size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.slotTitle}>Morning Water Supply</Text>
              <Text style={styles.slotTime}>
                {schedule?.morningSlot.start || '06:00 AM'} - {schedule?.morningSlot.end || '08:30 AM'}
              </Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>COMPLETED</Text>
            </View>
          </View>

          <View style={[styles.slotRow, { marginTop: 12 }]}>
            <View style={styles.slotIconBox}>
              <Clock size={20} color={Colors.secondary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.slotTitle}>Evening Water Supply</Text>
              <Text style={styles.slotTime}>
                {schedule?.eveningSlot.start || '05:30 PM'} - {schedule?.eveningSlot.end || '07:30 PM'}
              </Text>
            </View>
            <View style={[styles.activeTag, { backgroundColor: Colors.infoLight }]}>
              <Text style={[styles.activeTagText, { color: Colors.secondary }]}>UPCOMING</Text>
            </View>
          </View>
        </GlassCard>

        {/* Reservoir Source Info */}
        <GlassCard style={styles.card} intensity={45}>
          <Text style={styles.sectionTitle}>RESERVOIR & DISTRIBUTION SOURCE</Text>

          <View style={styles.sourceRow}>
            <MapPin size={20} color={Colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.sourceTitle}>Primary Reservoir Source</Text>
              <Text style={styles.sourceValue}>
                {schedule?.reservoirSource || 'Simhachalam Hill Reservoir & Yeleru Main Line'}
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.title3,
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  wardTag: {
    ...Typography.footnoteMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  gaugeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  pressureValue: {
    ...Typography.largeTitle,
    fontSize: 42,
    color: Colors.primary,
    fontWeight: '800',
  },
  pressureUnit: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginTop: -4,
  },
  statusLabel: {
    ...Typography.caption2,
    color: Colors.success,
    fontWeight: '800',
    marginTop: 2,
  },
  countdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
  },
  cdLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  cdTime: {
    ...Typography.title2,
    color: Colors.text,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  sectionTitle: {
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    borderRadius: 14,
  },
  slotIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotTitle: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '700',
  },
  slotTime: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activeTag: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeTagText: {
    ...Typography.caption2,
    color: Colors.success,
    fontWeight: '700',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceTitle: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  sourceValue: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
});
