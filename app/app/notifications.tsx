import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, CheckCheck, Droplets, Wrench, ShieldAlert, CloudRain } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { MOCK_NOTIFICATIONS, NotificationItem } from '../data/mockNotifications';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUPPLY_START':
      case 'SUPPLY_END':
        return <Droplets size={18} color={Colors.primary} />;
      case 'MAINTENANCE':
        return <Wrench size={18} color={Colors.warning} />;
      case 'WEATHER_ALERT':
        return <CloudRain size={18} color={Colors.secondary} />;
      case 'EMERGENCY':
      case 'QUALITY_ALERT':
      default:
        return <ShieldAlert size={18} color={Colors.error} />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Municipal Bulletins</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
          <CheckCheck size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <GlassCard
            style={[styles.itemCard, !item.isRead && styles.unreadCard]}
            intensity={40}
          >
            <View style={styles.itemRow}>
              <View style={styles.iconCircle}>{getIcon(item.type)}</View>
              <View style={styles.itemContent}>
                <View style={styles.itemTitleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemTime}>{item.timestamp}</Text>
                </View>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
            </View>
          </GlassCard>
        )}
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
    marginBottom: 14,
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
  markReadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 40,
  },
  itemCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: BorderRadius.card, // 24px
  },
  unreadCard: {
    borderColor: 'rgba(0, 91, 172, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15,
    flex: 1,
  },
  itemTime: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    marginLeft: 8,
  },
  itemDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
});
