import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, UserCheck, Star, MessageSquare } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TimelineStep } from '../components/complaints/TimelineStep';
import { ComplaintData } from '../services/complaintService';

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
    created_at: '2026-07-26T06:30:00Z',
    assigned_engineer: 'Er. S. Naidu (Zone 2 Water Head)',
  };

  if (params.complaintJson) {
    try {
      complaint = JSON.parse(params.complaintJson);
    } catch {}
  }

  const [rating, setRating] = useState(5);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint #{complaint.id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Complaint Overview Card */}
        <GlassCard style={styles.card} intensity={45}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{complaint.title || 'Water Supply Issue'}</Text>
            <StatusBadge status={(complaint.status as any) || 'PENDING'} />
          </View>
          <Text style={styles.desc}>{complaint.description}</Text>

          <View style={styles.engineerBox}>
            <UserCheck size={20} color={Colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.engineerLabel}>ASSIGNED FIELD ENGINEER</Text>
              <Text style={styles.engineerName}>{complaint.assigned_engineer || 'Er. S. Naidu'}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Resolution Timeline */}
        <GlassCard style={styles.card} intensity={45}>
          <Text style={styles.sectionTitle}>STATUS TIMELINE</Text>

          <TimelineStep
            title="Complaint Submitted"
            subtitle="Registered via Citizen Mobile App with GPS coordinates."
            timestamp="06:30 AM"
            isCompleted={true}
            isCurrent={false}
          />
          <TimelineStep
            title="Sector Admin Received"
            subtitle="Routed to MVP Colony Control Room system."
            timestamp="06:35 AM"
            isCompleted={true}
            isCurrent={false}
          />
          <TimelineStep
            title="Engineer Assigned"
            subtitle="Er. S. Naidu dispatched for field inspection."
            timestamp="07:10 AM"
            isCompleted={true}
            isCurrent={false}
          />
          <TimelineStep
            title="Work In Progress"
            subtitle="Pipeline booster valve adjustment underway."
            timestamp="08:00 AM"
            isCompleted={complaint.status === 'RESOLVED'}
            isCurrent={complaint.status === 'IN_PROGRESS'}
          />
          <TimelineStep
            title="Resolution Verified"
            subtitle="Pressure restored above 3.0 bar standard."
            isCompleted={complaint.status === 'RESOLVED'}
            isCurrent={false}
            isLast={true}
          />
        </GlassCard>

        {/* Citizen Rating UI if Resolved */}
        {complaint.status === 'RESOLVED' && (
          <GlassCard style={styles.card} intensity={45}>
            <Text style={styles.sectionTitle}>RATE RESOLUTION QUALITY</Text>
            <Text style={styles.ratingSubtitle}>How satisfied are you with the municipal response time?</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Star
                    size={32}
                    color={s <= rating ? Colors.warning : Colors.textTertiary}
                    fill={s <= rating ? Colors.warning : 'transparent'}
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <GlassButton
              title="Submit Rating"
              onPress={() => Alert.alert('Thank You', 'Your rating helps GVMC improve water service quality.')}
              variant="secondary"
              style={{ marginTop: 14 }}
            />
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
    paddingBottom: 100,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    ...Typography.title2,
    color: Colors.text,
    flex: 1,
    marginRight: 10,
  },
  desc: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  engineerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    padding: 14,
    borderRadius: 14,
  },
  engineerLabel: {
    ...Typography.caption2,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  engineerName: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  ratingSubtitle: {
    ...Typography.subhead,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
