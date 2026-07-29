import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CheckCircle2, Clock, ShieldCheck, Wrench, UserCheck, MapPin, CheckCircle } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';

export interface TimelineStage {
  key: 'submitted' | 'accepted' | 'assigned' | 'reached' | 'repair' | 'completed';
  title: string;
  subtitle: string;
  timestamp?: string;
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
}

interface ComplaintTimelineProps {
  currentStageIndex: number;
  createdAt?: string;
  engineerName?: string;
}

export function ComplaintTimeline({ currentStageIndex = 2, createdAt, engineerName }: ComplaintTimelineProps) {
  const STAGES: TimelineStage[] = [
    {
      key: 'submitted',
      title: 'Submitted',
      subtitle: 'Grievance logged via GVMC Citizen App',
      timestamp: createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:15 AM',
      status: currentStageIndex >= 0 ? (currentStageIndex === 0 ? 'CURRENT' : 'COMPLETED') : 'UPCOMING',
    },
    {
      key: 'accepted',
      title: 'Accepted',
      subtitle: 'Municipal Control Room verified ticket',
      timestamp: currentStageIndex >= 1 ? '10:22 AM' : undefined,
      status: currentStageIndex >= 1 ? (currentStageIndex === 1 ? 'CURRENT' : 'COMPLETED') : 'UPCOMING',
    },
    {
      key: 'assigned',
      title: 'Assigned',
      subtitle: `Assigned to ${engineerName || 'Er. S. Naidu (Zone 2)'}`,
      timestamp: currentStageIndex >= 2 ? '10:35 AM' : undefined,
      status: currentStageIndex >= 2 ? (currentStageIndex === 2 ? 'CURRENT' : 'COMPLETED') : 'UPCOMING',
    },
    {
      key: 'reached',
      title: 'Engineer Reached',
      subtitle: 'Maintenance crew arrived at location',
      timestamp: currentStageIndex >= 3 ? '11:10 AM' : undefined,
      status: currentStageIndex >= 3 ? (currentStageIndex === 3 ? 'CURRENT' : 'COMPLETED') : 'UPCOMING',
    },
    {
      key: 'repair',
      title: 'Repair In Progress',
      subtitle: 'Replacing damaged valve seal & testing flow',
      timestamp: currentStageIndex >= 4 ? '11:45 AM' : undefined,
      status: currentStageIndex >= 4 ? (currentStageIndex === 4 ? 'CURRENT' : 'COMPLETED') : 'UPCOMING',
    },
    {
      key: 'completed',
      title: 'Completed',
      subtitle: 'Water flow restored & SLA verified',
      timestamp: currentStageIndex >= 5 ? '12:30 PM' : undefined,
      status: currentStageIndex >= 5 ? 'COMPLETED' : 'UPCOMING',
    },
  ];

  return (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineHeader}>RESOLUTION PROGRESS TIMELINE</Text>
      {STAGES.map((stage, idx) => {
        const isCompleted = stage.status === 'COMPLETED';
        const isCurrent = stage.status === 'CURRENT';
        const isLast = idx === STAGES.length - 1;

        return (
          <View key={stage.key} style={styles.stepRow}>
            <View style={styles.leftCol}>
              <View
                style={[
                  styles.nodeCircle,
                  isCompleted && styles.nodeCompleted,
                  isCurrent && styles.nodeCurrent,
                ]}
              >
                {isCompleted ? (
                  <CheckCircle size={14} color="#FFF" />
                ) : isCurrent ? (
                  <Clock size={14} color="#FFF" />
                ) : (
                  <View style={styles.nodeDotUpcoming} />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.connectorLine,
                    isCompleted && styles.connectorCompleted,
                  ]}
                />
              )}
            </View>

            <View style={styles.rightCol}>
              <View style={styles.titleRow}>
                <Text style={[styles.stageTitle, isCurrent && styles.stageTitleCurrent]}>
                  {stage.title}
                </Text>
                {stage.timestamp && <Text style={styles.timestampText}>{stage.timestamp}</Text>}
              </View>
              <Text style={styles.stageSubtitle}>{stage.subtitle}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  timelineContainer: {
    marginVertical: 12,
  },
  timelineHeader: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  nodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeCompleted: {
    backgroundColor: Colors.success,
  },
  nodeCurrent: {
    backgroundColor: Colors.primary,
  },
  nodeDotUpcoming: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textTertiary,
  },
  connectorLine: {
    width: 2,
    height: 32,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  connectorCompleted: {
    backgroundColor: Colors.success,
  },
  rightCol: {
    flex: 1,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageTitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  stageTitleCurrent: {
    color: Colors.primary,
    fontWeight: '700',
  },
  timestampText: {
    ...Typography.caption2,
    color: Colors.textTertiary,
  },
  stageSubtitle: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
