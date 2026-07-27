import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { AnimatedHeader } from '../../components/ui/AnimatedHeader';
import { WaterStatusCard } from '../../components/home/WaterStatusCard';
import { QuickActionCard } from '../../components/home/QuickActionCard';
import { NetworkHealthCard } from '../../components/home/NetworkHealthCard';
import { WaterQualityCard } from '../../components/home/WaterQualityCard';
import { NotificationPreview } from '../../components/home/NotificationPreview';
import { ISSUE_TYPES, IssueType } from '../../data/issueTypes';
import { useAuthStore } from '../../store/authStore';
import { useWaterStatus } from '../../hooks/useWaterStatus';
import { MOCK_NOTIFICATIONS } from '../../data/mockNotifications';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const sectorId = user?.sectorId || 'SEC_MVP';
  const { schedule, nodes } = useWaterStatus(sectorId);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const handleQuickAction = (item: IssueType) => {
    router.push({
      pathname: '/report-issue',
      params: { issueTypeId: item.id },
    });
  };

  return (
    <View style={styles.container}>
      <AnimatedHeader
        userName={user?.name || 'Ramesh Kumar'}
        sectorName={user?.sectorName || 'MVP Colony Sector'}
        wardNumber={user?.wardNumber || 'Ward 42'}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />}
      >
        {/* Today's Water Supply Card */}
        <WaterStatusCard schedule={schedule} />

        {/* Quick Actions Grid Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <Text style={styles.sectionSubtitle}>Report issues or make requests</Text>
        </View>

        <View style={styles.actionsGrid}>
          {ISSUE_TYPES.map((item) => (
            <QuickActionCard key={item.id} item={item} onPress={handleQuickAction} />
          ))}
        </View>

        {/* Municipal Network Telemetry */}
        <NetworkHealthCard totalNodes={nodes.length || 15} />

        {/* Water Quality Indicators */}
        <WaterQualityCard
          wqi={schedule?.waterQualityIndex}
          ph={schedule?.phLevel}
          chlorine={schedule?.chlorinePpm}
          turbidity={schedule?.turbidityNtu}
        />

        {/* Recent Notifications Feed */}
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
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  sectionSubtitle: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
