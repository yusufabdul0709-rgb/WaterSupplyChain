import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShieldCheck, Star, Phone, MapPin, Calendar, Clock } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ComplaintTimeline } from '../components/complaints/TimelineStep';
import { ComplaintData } from '../services/complaintService';
import { formatDateString } from '../utils/time';

export default function ComplaintDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; complaintJson?: string }>();

  let complaint: ComplaintData = {
    id: params.id || 'CMP-9A4F21',
    title: 'Low Water Pressure',
    description: 'Tap water pressure drops below 1.0 bar during morning supply hour (06:30 AM).',
    lat: 17.738,
    lng: 83.332,
    sector_id: 'SEC_MVP',
    sector_name: 'MVP Colony Sector',
    citizen_name: 'Ramesh Kumar',
    phone: '+91 98480 12345',
    status: 'IN_PROGRESS',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    assigned_engineer: 'Er. S. Naidu (Zone 2 Water Head)',
  };

  if (params.complaintJson) {
    try {
      complaint = JSON.parse(params.complaintJson);
    } catch {}
  }

  const [rating, setRating] = useState(5);

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

  const handleCallEngineer = () => {
    Alert.alert('Call Municipal Control Room', 'Connecting to Er. S. Naidu (+91 891 250002)...');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grievance #{complaint.id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Complaint Overview Card */}
        <GlassCard style={styles.card} intensity={40} variant="elevated">
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{complaint.title || 'Water Supply Issue'}</Text>
            <StatusBadge status={(complaint.status as any) || 'PENDING'} />
          </View>
          <Text style={styles.desc}>{complaint.description}</Text>

          <View style={styles.metaRow}>
            <MapPin size={14} color={Colors.primary} />
            <Text style={styles.metaText}>{complaint.sector_name || 'MVP Colony Sector (Ward 42)'}</Text>
          </View>

          <View style={[styles.metaRow, { marginTop: 6 }]}>
            <Calendar size={14} color={Colors.textTertiary} />
            <Text style={styles.metaText}>Submitted: {formatDateString(complaint.created_at)}</Text>
          </View>
        </GlassCard>

        {/* Assigned Engineer Card */}
        <GlassCard style={styles.card} intensity={40}>
          <Text style={styles.sectionTitle}>ASSIGNED MUNICIPAL ENGINEER</Text>
          <View style={styles.engineerRow}>
            <View style={styles.engineerAvatar}>
              <ShieldCheck size={20} color={Colors.primary} />
            </View>
            <View style={styles.engineerDetails}>
              <Text style={styles.engineerName}>{complaint.assigned_engineer || 'Er. S. Naidu'}</Text>
              <Text style={styles.engineerTitle}>Zone 2 Water Supply Division · GVMC</Text>
            </View>
            <TouchableOpacity onPress={handleCallEngineer} style={styles.callBtn}>
              <Phone size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Swiggy/Zomato/Uber 6-Stage Resolution Timeline */}
        <GlassCard style={styles.card} intensity={40}>
          <ComplaintTimeline
            currentStageIndex={getStageIndex(complaint.status)}
            createdAt={complaint.created_at}
            engineerName={complaint.assigned_engineer}
          />
        </GlassCard>

        {/* Rating Feedback Box if Resolved */}
        {complaint.status === 'RESOLVED' && (
          <GlassCard style={styles.card} intensity={40}>
            <Text style={styles.sectionTitle}>RATE RESOLUTION QUALITY</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Star size={28} color={s <= rating ? '#F59E0B' : '#CBD5E1'} fill={s <= rating ? '#F59E0B' : 'transparent'} />
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        )}
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
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.cardTitle,
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    marginBottom: 16,
    borderRadius: BorderRadius.card, // 24px
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.text,
    fontSize: 18,
    flex: 1,
    marginRight: 8,
  },
  desc: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  sectionTitle: {
    ...Typography.label,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  engineerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engineerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  engineerDetails: {
    flex: 1,
  },
  engineerName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  engineerTitle: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
