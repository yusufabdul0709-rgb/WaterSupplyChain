import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, ArrowRight } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import { ComplaintData } from '../../services/complaintService';
import { formatDateString } from '../../utils/time';

interface ComplaintCardProps {
  complaint: ComplaintData;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: '/complaint-details',
          params: { id: complaint.id, complaintJson: JSON.stringify(complaint) },
        })
      }
    >
      <GlassCard style={styles.card} intensity={45}>
        <View style={styles.header}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>#{complaint.id}</Text>
          </View>
          <StatusBadge status={(complaint.status as any) || 'PENDING'} size="sm" />
        </View>

        <Text style={styles.title}>{complaint.title || complaint.issue_type || 'Water Supply Issue'}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {complaint.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.metaGroup}>
            <View style={styles.metaRow}>
              <MapPin size={12} color={Colors.primary} />
              <Text style={styles.metaText}>{complaint.sector_name || complaint.sector_id}</Text>
            </View>
            <View style={[styles.metaRow, { marginLeft: 12 }]}>
              <Calendar size={12} color={Colors.textTertiary} />
              <Text style={styles.metaText}>{formatDateString(complaint.created_at)}</Text>
            </View>
          </View>

          <ArrowRight size={16} color={Colors.primary} />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  idText: {
    ...Typography.caption2,
    color: Colors.primary,
    fontWeight: '700',
  },
  title: {
    ...Typography.title3,
    color: Colors.text,
    fontSize: 17,
  },
  description: {
    ...Typography.subhead,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});
