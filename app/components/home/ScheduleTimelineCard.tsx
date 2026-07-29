import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Sun, Moon, Wrench, CheckCircle2, Clock } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { WaterSchedule } from '../../data/mockWaterSchedule';

interface ScheduleTimelineCardProps {
  schedule?: WaterSchedule;
}

export function ScheduleTimelineCard({ schedule }: ScheduleTimelineCardProps) {
  const morningSlot = schedule?.morningSlot || { start: '06:00 AM', end: '08:30 AM' };
  const eveningSlot = schedule?.eveningSlot || { start: '05:30 PM', end: '07:30 PM' };

  return (
    <GlassCard style={styles.card} intensity={40}>
      <Text style={styles.sectionHeader}>TODAY'S SCHEDULE TIMELINE</Text>
      <Text style={styles.cardTitle}>Municipal Distribution Slots</Text>

      <View style={styles.timelineContainer}>
        {/* Morning Slot */}
        <View style={styles.timelineRow}>
          <View style={styles.iconCircleCompleted}>
            <Sun size={18} color={Colors.success} />
          </View>
          <View style={styles.slotDetails}>
            <View style={styles.slotHeader}>
              <Text style={styles.slotName}>Morning Supply</Text>
              <View style={styles.tagCompleted}>
                <Text style={styles.tagTextCompleted}>COMPLETED</Text>
              </View>
            </View>
            <Text style={styles.slotTime}>
              {morningSlot.start} - {morningSlot.end} · High Pressure (3.4 bar)
            </Text>
          </View>
        </View>

        <View style={styles.connectorLine} />

        {/* Evening Slot */}
        <View style={styles.timelineRow}>
          <View style={styles.iconCircleUpcoming}>
            <Moon size={18} color={Colors.primary} />
          </View>
          <View style={styles.slotDetails}>
            <View style={styles.slotHeader}>
              <Text style={styles.slotName}>Evening Supply</Text>
              <View style={styles.tagUpcoming}>
                <Text style={styles.tagTextUpcoming}>UPCOMING</Text>
              </View>
            </View>
            <Text style={styles.slotTime}>
              {eveningSlot.start} - {eveningSlot.end} · Target Pressure (3.5 bar)
            </Text>
          </View>
        </View>

        <View style={styles.connectorLine} />

        {/* Maintenance Slot */}
        <View style={styles.timelineRow}>
          <View style={styles.iconCircleMaintenance}>
            <Wrench size={18} color={Colors.warning} />
          </View>
          <View style={styles.slotDetails}>
            <View style={styles.slotHeader}>
              <Text style={styles.slotName}>Scheduled Maintenance Window</Text>
              <View style={styles.tagMaintenance}>
                <Text style={styles.tagTextMaintenance}>NORMAL</Text>
              </View>
            </View>
            <Text style={styles.slotTime}>11:30 PM - 02:00 AM · Automated AMRUT Pipe Flushing</Text>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  cardTitle: {
    ...Typography.cardTitle,
    color: Colors.text,
    marginTop: 2,
    marginBottom: 16,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircleCompleted: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.successLight,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleUpcoming: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 91, 172, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleMaintenance: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.warningLight,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectorLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    marginLeft: 17,
    marginVertical: 4,
  },
  slotDetails: {
    flex: 1,
    marginLeft: 12,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  slotTime: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tagCompleted: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  tagTextCompleted: {
    ...Typography.label,
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  tagUpcoming: {
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  tagTextUpcoming: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  tagMaintenance: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  tagTextMaintenance: {
    ...Typography.label,
    color: '#D97706',
    fontSize: 10,
    fontWeight: '700',
  },
});
