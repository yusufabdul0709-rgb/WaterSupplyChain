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

  const isEmergency = item.category === 'emergency';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.card,
        isEmergency && styles.emergencyCard,
        style,
      ]}
    >
      <View style={[styles.iconBox, isEmergency && styles.emergencyIconBox]}>
        <IconComponent size={24} color={isEmergency ? Colors.danger : Colors.primary} />
      </View>
      <Text style={[styles.title, isEmergency && styles.emergencyText]} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  emergencyCard: {
    backgroundColor: Colors.dangerLight,
    borderColor: 'rgba(229, 57, 53, 0.3)',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  emergencyIconBox: {
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
  },
  title: {
    ...Typography.subheadMedium,
    color: Colors.text,
    flex: 1,
    fontWeight: '600',
  },
  emergencyText: {
    color: Colors.danger,
    fontWeight: '700',
  },
});
