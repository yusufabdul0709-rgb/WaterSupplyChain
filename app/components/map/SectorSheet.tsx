import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Activity, Droplets } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { Sector } from '../../constants/sectors';

interface SectorSheetProps {
  sector: Sector;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

const FILTERS = [
  { id: 'ALL', label: 'All Assets' },
  { id: 'RESERVOIR', label: 'Reservoirs' },
  { id: 'PUMP', label: 'Pumps' },
  { id: 'ISSUES', label: 'Complaints' },
];

export function SectorSheet({ sector, activeFilter, onSelectFilter }: SectorSheetProps) {
  return (
    <View style={styles.sheetContainer}>
      <GlassCard style={styles.card} intensity={70} variant="dark">
        <View style={styles.handleBar} />
        <View style={styles.header}>
          <View>
            <View style={styles.locationTag}>
              <MapPin size={12} color={Colors.accent} />
              <Text style={styles.zoneText}>{sector.zone} · VIZAG DIGITAL TWIN</Text>
            </View>
            <Text style={styles.sectorTitle}>{sector.name}</Text>
          </View>
          <View style={styles.mldBadge}>
            <Text style={styles.mldValue}>89.5</Text>
            <Text style={styles.mldLabel}>MLD Flow</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTERS.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                activeOpacity={0.7}
                onPress={() => onSelectFilter(f.id)}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    zIndex: 900,
  },
  card: {
    padding: 16,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneText: {
    ...Typography.caption2,
    color: Colors.accent,
    fontWeight: '700',
    marginLeft: 4,
  },
  sectorTitle: {
    ...Typography.title3,
    color: Colors.textInverse,
    marginTop: 2,
  },
  mldBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  mldValue: {
    ...Typography.headline,
    color: Colors.accent,
    fontWeight: '800',
  },
  mldLabel: {
    ...Typography.caption2,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  filterChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterChipText: {
    ...Typography.footnoteMedium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterChipTextActive: {
    color: Colors.mapDark,
    fontWeight: '700',
  },
});
