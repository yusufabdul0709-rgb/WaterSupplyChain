import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Filter, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { ComplaintCard } from '../../components/complaints/ComplaintCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { complaintService, ComplaintData } from '../../services/complaintService';

const MOCK_CITIZEN_COMPLAINTS: ComplaintData[] = [
  {
    id: 'CMP-9A4F21',
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
    assigned_engineer: 'Er. S. Naidu (MVP Head)',
  },
  {
    id: 'CMP-8B2E10',
    title: 'Discolored Tap Water',
    description: 'Muddy discolored water coming from main supply pipe after heavy rain.',
    lat: 17.735,
    lng: 83.33,
    sector_id: 'SEC_MVP',
    sector_name: 'MVP Colony Sector',
    citizen_name: 'Ramesh Kumar',
    phone: '+91 98480 12345',
    status: 'RESOLVED',
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    assigned_engineer: 'Er. K. Rao',
  },
];

export default function ComplaintsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'my' | 'ward'>('my');
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ['myComplaints', user?.sectorId],
    queryFn: () => complaintService.listComplaints(user?.sectorId),
  });

  const apiComplaints = data?.data || [];
  const displayComplaints = apiComplaints.length > 0 ? apiComplaints : MOCK_CITIZEN_COMPLAINTS;

  const totalCount = displayComplaints.length;
  const openCount = displayComplaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolvedCount = displayComplaints.filter((c) => c.status === 'RESOLVED').length;
  const pendingCount = displayComplaints.filter((c) => c.status === 'PENDING' || !c.status).length;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.govtTitle}>GVMC GRIEVANCE PORTAL</Text>
          <Text style={styles.title}>Complaint Dashboard</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/report-issue')}
          style={styles.newReportBtn}
        >
          <Plus size={18} color="#FFF" />
          <Text style={styles.newReportText}>Report Issue</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayComplaints}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.dashboardHeader}>
            {/* Top Statistics Grid: Total, Open, Resolved, Pending */}
            <View style={styles.statsGrid}>
              <GlassCard style={styles.statMiniCard} intensity={40}>
                <Text style={styles.statNum}>{totalCount}</Text>
                <Text style={styles.statLbl}>Total</Text>
              </GlassCard>

              <GlassCard style={styles.statMiniCard} intensity={40}>
                <Text style={[styles.statNum, { color: Colors.info }]}>{openCount}</Text>
                <Text style={styles.statLbl}>Open</Text>
              </GlassCard>

              <GlassCard style={styles.statMiniCard} intensity={40}>
                <Text style={[styles.statNum, { color: Colors.success }]}>{resolvedCount}</Text>
                <Text style={styles.statLbl}>Resolved</Text>
              </GlassCard>

              <GlassCard style={styles.statMiniCard} intensity={40}>
                <Text style={[styles.statNum, { color: Colors.warning }]}>{pendingCount}</Text>
                <Text style={styles.statLbl}>Pending</Text>
              </GlassCard>
            </View>

            {/* Filter Tabs: My Complaints vs Ward Complaints */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTab('my')}
                style={[styles.tabChip, activeTab === 'my' && styles.tabChipActive]}
              >
                <Text style={[styles.tabChipText, activeTab === 'my' && styles.tabChipTextActive]}>
                  My Complaints ({displayComplaints.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTab('ward')}
                style={[styles.tabChip, activeTab === 'ward' && styles.tabChipActive]}
              >
                <Text style={[styles.tabChipText, activeTab === 'ward' && styles.tabChipTextActive]}>
                  Ward Grievances
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => <ComplaintCard complaint={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ShieldCheck size={48} color={Colors.primary} />
            <Text style={styles.emptyTitle}>No Complaints Found</Text>
            <Text style={styles.emptySubtitle}>All water supply lines in your ward are operating normally.</Text>
            <GlassButton
              title="Report New Issue"
              onPress={() => router.push('/report-issue')}
              variant="outline"
              style={{ marginTop: 16 }}
            />
          </View>
        }
      />
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
    marginBottom: 16,
  },
  govtTitle: {
    ...Typography.label,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...Typography.pageTitle,
    color: Colors.text,
    fontSize: 26,
    marginTop: 1,
  },
  newReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.button, // 18px
  },
  newReportText: {
    ...Typography.bodyMedium,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 4,
  },
  dashboardHeader: {
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statMiniCard: {
    width: '23.5%',
    padding: 12,
    alignItems: 'center',
    borderRadius: BorderRadius.card, // 24px
  },
  statNum: {
    ...Typography.sectionTitle,
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 20,
  },
  statLbl: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabChipText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 110,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    ...Typography.sectionTitle,
    color: Colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
});
