import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Clock, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import { ComplaintData } from '../../services/complaintService';
import { formatDateString } from '../../utils/time';
import { ComplaintTimeline } from './TimelineStep';

interface ComplaintCardProps {
  complaint: ComplaintData;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const router = useRouter();
  const [showTimeline, setShowTimeline] = useState(false);

  const priority = complaint.issue_type === 'report_leak' || complaint.issue_type === 'dirty_water' ? 'CRITICAL' : 'MEDIUM';

  const getStageIndex = (status?: string) => {
    switch (status) {
      case 'RESOLVED':
        return 5;
      case 'IN_PROGRESS':
        return 3;
      case 'ASSIGNED':
        return 2;
      case 'PENDING':
      default:
        return 1;
    }
  };

  const stageIdx = getStageIndex(complaint.status);

  return (
    <GlassCard style={styles.card} intensity={45}>
      {/* Top Header Row */}
      <View style={styles.header}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{complaint.id}</Text>
        </View>
        <View style={styles.badgeRow}>
          <StatusBadge status={(complaint.status as any) || 'PENDING'} size="sm" />
          <View style={[styles.priorityTag, priority === 'CRITICAL' && styles.priorityCritical]}>
            <Text style={[styles.priorityText, priority === 'CRITICAL' && styles.priorityTextCritical]}>
              {priority}
            </Text>
          </View>
        </View>
      </View>

      {/* Issue Title & Description */}
      <Text style={styles.title}>{complaint.title || complaint.issue_type || 'Water Supply Issue'}</Text>
      <Text style={styles.description} numberOfLines={ showTimeline ? undefined : 2 }>
        {complaint.description}
      </Text>

      {/* Photo Preview Thumbnail Placeholder */}
      <View style={styles.photoContainer}>
        <View style={styles.photoBox}>
          <Text style={styles.photoText}>📸 Photo Attached (Tap details to view)</Text>
        </View>
      </View>

      {/* Location & Meta Info */}
      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <MapPin size={14} color={Colors.primary} />
          <Text style={styles.metaText}>{complaint.sector_name || complaint.sector_id || 'Ward 42, MVP Colony'}</Text>
        </View>
        <View style={styles.metaRow}>
          <Calendar size={14} color={Colors.textTertiary} />
          <Text style={styles.metaText}>{formatDateString(complaint.created_at)}</Text>
        </View>
      </View>

      {/* Assigned Engineer & Est. Resolution */}
      <View style={styles.engineerCard}>
        <ShieldCheck size={16} color={Colors.primary} />
        <View style={styles.engineerInfo}>
          <Text style={styles.engineerLabel}>Assigned Engineer</Text>
          <Text style={styles.engineerValue}>{complaint.assigned_engineer || 'Er. S. Naidu (Zone 2 Lead)'}</Text>
        </View>
        <View style={styles.etaBadge}>
          <Clock size={12} color={Colors.secondary} />
          <Text style={styles.etaText}>Est: 2 hrs</Text>
        </View>
      </View>

      {/* Toggle Timeline Section */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setShowTimeline(!showTimeline)}
        style={styles.timelineToggle}
      >
        <Text style={styles.timelineToggleText}>
          {showTimeline ? 'Hide Resolution Timeline' : 'View Swiggy-Style Live Progress Timeline'}
        </Text>
        {showTimeline ? <ChevronUp size={16} color={Colors.primary} /> : <ChevronDown size={16} color={Colors.primary} />}
      </TouchableOpacity>

      {showTimeline && (
        <ComplaintTimeline
          currentStageIndex={stageIdx}
          createdAt={complaint.created_at}
          engineerName={complaint.assigned_engineer}
        />
      )}

      {/* Action Footer Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: '/complaint-details',
            params: { id: complaint.id, complaintJson: JSON.stringify(complaint) },
          })
        }
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>Full Grievance Details & Escalation</Text>
        <ArrowRight size={16} color="#FFF" />
      </TouchableOpacity>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 16,
    borderRadius: BorderRadius.card, // 24px
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  idBadge: {
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  idText: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    marginLeft: 6,
  },
  priorityCritical: {
    backgroundColor: Colors.dangerLight,
  },
  priorityText: {
    ...Typography.label,
    color: Colors.info,
    fontSize: 10,
    fontWeight: '700',
  },
  priorityTextCritical: {
    color: Colors.error,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.text,
    fontSize: 17,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  photoContainer: {
    marginBottom: 12,
  },
  photoBox: {
    backgroundColor: 'rgba(245, 247, 250, 0.8)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  engineerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 91, 172, 0.05)',
    padding: 10,
    borderRadius: BorderRadius.md,
    marginBottom: 12,
  },
  engineerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  engineerLabel: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontSize: 10,
  },
  engineerValue: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  etaText: {
    ...Typography.caption2,
    color: Colors.secondary,
    fontWeight: '700',
    marginLeft: 4,
  },
  timelineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 10,
  },
  timelineToggleText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.button, // 18px
    marginTop: 4,
  },
  actionBtnText: {
    ...Typography.bodyMedium,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
