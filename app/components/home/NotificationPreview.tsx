import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Bell, ArrowRight, Droplets, Wrench, ShieldAlert } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { NotificationItem } from '../../data/mockNotifications';

interface NotificationPreviewProps {
  items: NotificationItem[];
}

export function NotificationPreview({ items }: NotificationPreviewProps) {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUPPLY_START':
      case 'SUPPLY_END':
        return <Droplets size={16} color={Colors.primary} />;
      case 'MAINTENANCE':
        return <Wrench size={16} color={Colors.warning} />;
      case 'EMERGENCY':
      case 'QUALITY_ALERT':
      default:
        return <ShieldAlert size={16} color={Colors.error} />;
    }
  };

  return (
    <GlassCard style={styles.card} intensity={40}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.sectionHeader}>RECENT NOTIFICATIONS</Text>
          <Text style={styles.title}>Municipal Bulletins</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.viewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <ArrowRight size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {items.slice(0, 3).map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => router.push('/notifications')}
            style={[styles.itemRow, index === Math.min(items.length, 3) - 1 && styles.lastItem]}
          >
            <View style={styles.iconCircle}>{getIcon(item.type)}</View>
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemTime}>{item.timestamp}</Text>
              </View>
              <Text style={styles.itemDesc} numberOfLines={1}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 100, // Extra margin for floating bottom tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {},
  sectionHeader: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.text,
    marginTop: 2,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  list: {},
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
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
    marginTop: 2,
  },
});
