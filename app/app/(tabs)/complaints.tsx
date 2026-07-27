import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Filter } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { ComplaintCard } from '../../components/complaints/ComplaintCard';
import { GlassButton } from '../../components/ui/GlassButton';
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
  const [activeTab, setActiveTab] = useState<'my' | 'nearby'>('my');
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ['myComplaints', user?.sectorId],
    queryFn: () => complaintService.listComplaints(user?.sectorId),
  });

  const apiComplaints = data?.data || [];
  const displayComplaints = apiComplaints.length > 0 ? apiComplaints : MOCK_CITIZEN_COMPLAINTS;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.govtTitle}>MUNICIPAL GRIEVANCE PORTAL</Text>
          <Text style={styles.title}>Track Complaints</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/report-issue')}
          style={styles.newReportBtn}
        >
          <Plus size={18} color="#FFF" />
          <Text style={styles.newReportText}>Report Issue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('my')}
          style={[styles.tabChip, activeTab === 'my' && styles.tabChipActive]}
        >
          <Text style={[styles.tabChipText, activeTab === 'my' && styles.tabChipTextActive]}>
            My Complaints ({displayComplaints.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('nearby')}
          style={[styles.tabChip, activeTab === 'nearby' && styles.tabChipActive]}
        >
          <Text style={[styles.tabChipText, activeTab === 'nearby' && styles.tabChipTextActive]}>
            Sector Grievances
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayComplaints}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />}
        renderItem={({ item }) => <ComplaintCard complaint={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Grievances Reported</Text>
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
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...Typography.title1,
    color: Colors.text,
    marginTop: 2,
  },
  newReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  newReportText: {
    ...Typography.footnoteMedium,
    color: Colors.textInverse,
    fontWeight: '700',
    marginLeft: 4,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screen,
    marginBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  tabChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabChipText: {
    ...Typography.footnoteMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabChipTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    ...Typography.title2,
    color: Colors.text,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
});
