import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, CheckCheck, Droplets, Wrench, ShieldAlert, CloudRain } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../constants/theme';
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
        return <Droplets size={20} color={Colors.primary} />;
      case 'MAINTENANCE':
        return <Wrench size={20} color={Colors.warning} />;
      case 'WEATHER_ALERT':
        return <CloudRain size={20} color={Colors.secondary} />;
      case 'EMERGENCY':
      case 'QUALITY_ALERT':
      default:
        return <ShieldAlert size={20} color={Colors.danger} />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
          <CheckCheck size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <GlassCard style={[styles.card, !item.isRead && styles.unreadCard]} intensity={45}>
            <View style={styles.cardRow}>
              <View style={[styles.iconCircle, !item.isRead && styles.unreadIconCircle]}>
                {getIcon(item.type)}
              </View>

              <View style={styles.contentGroup}>
                <View style={styles.topRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.time}>{item.timestamp}</Text>
                </View>
                <Text style={styles.desc}>{item.description}</Text>
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
    marginBottom: 16,
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
  markReadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  unreadCard: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unreadIconCircle: {
    backgroundColor: 'rgba(0, 91, 172, 0.18)',
  },
  contentGroup: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '700',
    flex: 1,
  },
  time: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    marginLeft: 8,
  },
  desc: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
});
