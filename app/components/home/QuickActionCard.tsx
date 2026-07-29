import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Droplet,
  Gauge,
  Droplets,
  Beaker,
  ShieldAlert,
  Wrench,
  Waves,
  PlusCircle,
  Receipt,
  PhoneCall,
  AlertTriangle,
} from 'lucide-react-native';
import { Colors, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { IssueType } from '../../data/issueTypes';

interface QuickActionCardProps {
  item: IssueType;
  onPress: (item: IssueType) => void;
  style?: StyleProp<ViewStyle>;
}

const ICON_MAP: Record<string, any> = {
  'droplet-off': Droplet,
  gauge: Gauge,
  droplets: Droplets,
  beaker: Beaker,
  'shield-alert': ShieldAlert,
  wrench: Wrench,
  waves: Waves,
  'plus-circle': PlusCircle,
  receipt: Receipt,
  'phone-call': PhoneCall,
};

export function QuickActionCard({ item, onPress, style }: QuickActionCardProps) {
  const IconComponent = ICON_MAP[item.icon] || Droplets;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item);
  };

  const isEmergency = item.priority === 'CRITICAL';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.card,
        isEmergency && styles.emergencyCard,
        style,
      ]}
    >
      <View style={[styles.iconBox, isEmergency && styles.emergencyIconBox]}>
        <IconComponent size={22} color={isEmergency ? Colors.error : Colors.primary} />
      </View>
      <View style={styles.textGroup}>
        <Text style={[styles.title, isEmergency && styles.emergencyText]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          Report issue
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.card, // 24px
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.card,
  },
  emergencyCard: {
    backgroundColor: Colors.dangerLight,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  emergencyIconBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  textGroup: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  emergencyText: {
    color: Colors.error,
    fontWeight: '700',
  },
});
