import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { AnimatedHeader } from '../../components/ui/AnimatedHeader';
import { WaterStatusCard } from '../../components/home/WaterStatusCard';
import { ScheduleTimelineCard } from '../../components/home/ScheduleTimelineCard';
import { QuickActionCard } from '../../components/home/QuickActionCard';
import { LatestComplaintCard } from '../../components/home/LatestComplaintCard';
import { NotificationPreview } from '../../components/home/NotificationPreview';
import { ISSUE_TYPES, IssueType } from '../../data/issueTypes';
import { useAuthStore } from '../../store/authStore';
import { useWaterStatus } from '../../hooks/useWaterStatus';
import { useQuery } from '@tanstack/react-query';
import { complaintService } from '../../services/complaintService';
import { MOCK_NOTIFICATIONS } from '../../data/mockNotifications';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const sectorId = user?.sectorId || 'SEC_MVP';
  const { schedule, isLoadingSchedule } = useWaterStatus(sectorId);

  const { data: complaintsData, refetch: refetchComplaints } = useQuery({
    queryKey: ['myComplaints', sectorId],
    queryFn: () => complaintService.listComplaints(sectorId),
  });

  const latestComplaint = complaintsData?.data?.[0];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchComplaints();
    setRefreshing(false);
  };

  const handleQuickAction = (item: IssueType) => {
    router.push({
      pathname: '/report-issue',
      params: { issueTypeId: item.id },
    });
  };

  // Filter 8 primary quick action items requested by user:
  // Leak, No Water, Low Pressure, Dirty Water, Illegal Connection, Overflow, Broken Pipe, New Connection
  const quickActionsList = ISSUE_TYPES.slice(0, 8);

  return (
    <View style={styles.container}>
      <AnimatedHeader
        userName={user?.name || 'Ramesh Kumar'}
        sectorName={user?.sectorName || 'MVP Colony Sector'}
        wardNumber={user?.wardNumber || 'Ward 42'}
        zone={user?.zone || 'Zone 2'}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
        }
      >
        {/* 1. Today's Water Status Hero Card */}
        <WaterStatusCard schedule={schedule} />

        {/* 2. Today's Schedule Timeline Card */}
        <ScheduleTimelineCard schedule={schedule} />

        {/* 3. Quick Actions Grid (8 Items) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <Text style={styles.sectionSubtitle}>Report issues or request municipal services</Text>
        </View>

        <View style={styles.actionsGrid}>
          {quickActionsList.map((item) => (
            <QuickActionCard key={item.id} item={item} onPress={handleQuickAction} />
          ))}
        </View>

        {/* 4. Latest Complaint Status Preview */}
        <LatestComplaintCard complaint={latestComplaint} />

        {/* 5. Recent Notifications Feed */}
        <NotificationPreview items={MOCK_NOTIFICATIONS} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 16,
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.label,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
