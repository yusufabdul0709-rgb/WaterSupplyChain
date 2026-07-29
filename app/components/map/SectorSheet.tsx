import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Activity, Droplets, Gauge, Sparkles, ChevronUp, ChevronDown, Layers, ShieldCheck, Wrench } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { Sector } from '../../constants/sectors';

interface SectorSheetProps {
  sector: Sector;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

const ASSET_FILTERS = [
  { id: 'ALL', label: 'All Assets' },
  { id: 'RESERVOIR', label: 'Reservoirs' },
  { id: 'PIPELINES', label: 'Pipelines' },
  { id: 'VALVES', label: 'Valves' },
  { id: 'PUMP', label: 'Pumps' },
  { id: 'SENSORS', label: 'Sensors' },
  { id: 'COMPLAINTS', label: 'Complaints' },
];

export function SectorSheet({ sector, activeFilter, onSelectFilter }: SectorSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.sheetContainer}>
      <GlassCard style={styles.card} intensity={75} variant="dark">
        {/* Drag Handle Bar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.handleTouchable}
        >
          <View style={styles.handleBar} />
        </TouchableOpacity>

        {/* Sector Header Row */}
        <View style={styles.header}>
          <View>
            <View style={styles.locationTag}>
              <MapPin size={12} color={Colors.secondary} />
              <Text style={styles.zoneText}>{sector.zone} · GVMC DIGITAL TWIN</Text>
            </View>
            <Text style={styles.sectorTitle}>{sector.name}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsExpanded(!isExpanded)}
            style={styles.toggleBtn}
          >
            {isExpanded ? <ChevronDown size={18} color="#FFF" /> : <ChevronUp size={18} color="#FFF" />}
          </TouchableOpacity>
        </View>

        {/* Asset Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {ASSET_FILTERS.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                activeOpacity={0.75}
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

        {/* Primary Telemetry Grid */}
        <View style={styles.telemetryGrid}>
          <View style={styles.statBox}>
            <Gauge size={14} color={Colors.secondary} />
            <Text style={styles.statVal}>3.4 BAR</Text>
            <Text style={styles.statLbl}>Pressure</Text>
          </View>

          <View style={styles.statBox}>
            <Activity size={14} color={Colors.secondary} />
            <Text style={styles.statVal}>89.5 MLD</Text>
            <Text style={styles.statLbl}>Grid Flow</Text>
          </View>

          <View style={styles.statBox}>
            <Droplets size={14} color={Colors.success} />
            <Text style={styles.statVal}>98%</Text>
            <Text style={styles.statLbl}>Availability</Text>
          </View>
        </View>

        {/* Expanded Detailed Sector Breakdown */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Reservoir Storage</Text>
                <Text style={styles.detailValue}>92% Capacity</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Pump Telemetry</Text>
                <Text style={[styles.detailValue, { color: Colors.success }]}>Active · 1,450 RPM</Text>
              </View>
            </View>

            {/* AI Prediction Insight Box */}
            <View style={styles.aiBox}>
              <View style={styles.aiHeader}>
                <Sparkles size={14} color={Colors.secondary} />
                <Text style={styles.aiTitle}>GVMC AI Predictive Insights</Text>
              </View>
              <Text style={styles.aiText}>
                Optimal grid pressure maintained. 0 pipe stress anomalies predicted for the next 12 hours in Ward 42.
              </Text>
            </View>
          </View>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: 84,
    left: 16,
    right: 16,
    zIndex: 900,
  },
  card: {
    padding: 16,
    borderRadius: BorderRadius.bottomSheet, // 32px
  },
  handleTouchable: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneText: {
    ...Typography.label,
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  sectorTitle: {
    ...Typography.cardTitle,
    color: Colors.textInverse,
    fontSize: 18,
    marginTop: 1,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  filterChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  filterChipText: {
    ...Typography.caption2,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  telemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.md,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statVal: {
    ...Typography.bodyMedium,
    color: Colors.textInverse,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 2,
  },
  statLbl: {
    ...Typography.caption2,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  expandedSection: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption2,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  detailValue: {
    ...Typography.bodyMedium,
    color: Colors.textInverse,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 1,
  },
  aiBox: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderRadius: BorderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    marginTop: 6,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiTitle: {
    ...Typography.label,
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  aiText: {
    ...Typography.caption2,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    lineHeight: 15,
  },
});
