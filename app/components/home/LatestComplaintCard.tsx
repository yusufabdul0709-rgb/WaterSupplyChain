import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ClipboardList, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import { ComplaintData } from '../../services/complaintService';

interface LatestComplaintCardProps {
  complaint?: ComplaintData;
}

export function LatestComplaintCard({ complaint }: LatestComplaintCardProps) {
  const router = useRouter();

  const activeComplaint: ComplaintData = complaint || {
    id: 'CMP-9A4F21',
    title: 'Low Water Pressure',
    description: 'Tap water pressure drops below 1.0 bar during morning supply hour.',
    lat: 17.738,
    lng: 83.332,
    sector_id: 'SEC_MVP',
    status: 'IN_PROGRESS',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    assigned_engineer: 'Er. S. Naidu (MVP Head)',
    sector_name: 'MVP Colony Sector',
  };

  return (
    <GlassCard style={styles.card} intensity={40}>
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.sectionHeader}>LATEST COMPLAINT STATUS</Text>
          <Text style={styles.complaintId}>#{activeComplaint.id}</Text>
        </View>
        <StatusBadge status={(activeComplaint.status as any) || 'IN_PROGRESS'} size="sm" />
      </View>

      <Text style={styles.title}>{activeComplaint.title || 'Water Supply Grievance'}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {activeComplaint.description}
      </Text>

      {/* Engineer Assignment Bar */}
      <View style={styles.engineerBox}>
        <ShieldCheck size={16} color={Colors.primary} />
        <Text style={styles.engineerText}>
          Assigned: {activeComplaint.assigned_engineer || 'Er. S. Naidu (Municipal Engineer)'}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: '/complaint-details',
            params: { id: activeComplaint.id, complaintJson: JSON.stringify(activeComplaint) },
          })
        }
        style={styles.footerLink}
      >
        <Text style={styles.footerLinkText}>Track Resolution Progress & Timeline</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitleGroup: {},
  sectionHeader: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  complaintId: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginTop: 1,
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
  engineerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 91, 172, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  engineerText: {
    ...Typography.captionMedium,
    color: Colors.text,
    fontWeight: '600',
    marginLeft: 8,
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
