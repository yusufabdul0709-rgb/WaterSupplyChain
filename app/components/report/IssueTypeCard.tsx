import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  DropletOff,
  Gauge,
  Droplets,
  Beaker,
  ShieldAlert,
  Wrench,
  Waves,
  PlusCircle,
  Receipt,
  PhoneCall,
  CheckCircle,
} from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { IssueType } from '../../data/issueTypes';

interface IssueTypeCardProps {
  item: IssueType;
  isSelected: boolean;
  onSelect: (item: IssueType) => void;
}

const ICON_MAP: Record<string, any> = {
  'droplet-off': DropletOff,
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

export function IssueTypeCard({ item, isSelected, onSelect }: IssueTypeCardProps) {
  const IconComponent = ICON_MAP[item.icon] || Droplets;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onSelect(item)}
      style={[styles.card, isSelected && styles.selectedCard]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconBox, isSelected && styles.selectedIconBox]}>
          <IconComponent size={22} color={isSelected ? Colors.textInverse : Colors.primary} />
        </View>
        {isSelected && <CheckCircle size={18} color={Colors.primary} />}
      </View>

      <Text style={[styles.title, isSelected && styles.selectedTitle]}>{item.title}</Text>
      <Text style={styles.desc} numberOfLines={2}>
        {item.description}
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
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconBox: {
    backgroundColor: Colors.primary,
  },
  title: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '700',
  },
  selectedTitle: {
    color: Colors.primary,
  },
  desc: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
});
