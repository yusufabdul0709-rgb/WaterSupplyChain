import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Bell, ArrowRight, Droplets, Wrench, ShieldAlert } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
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
        return <ShieldAlert size={16} color={Colors.danger} />;
    }
  };

  return (
    <GlassCard style={styles.card} intensity={40}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Bell size={18} color={Colors.primary} />
          <Text style={styles.title}>Recent Notifications</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.viewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <ArrowRight size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {items.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => router.push('/notifications')}
            style={styles.itemRow}
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
    padding: 16,
    marginBottom: 100, // Extra margin for floating bottom tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...Typography.headline,
    color: Colors.text,
    marginLeft: 8,
    fontSize: 15,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...Typography.footnoteMedium,
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
    borderBottomColor: Colors.divider,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
  },
  itemTime: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    marginLeft: 8,
  },
  itemDesc: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
