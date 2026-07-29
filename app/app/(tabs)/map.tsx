import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw, Navigation, Search, Layers, ShieldCheck } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { SECTOR_MAP_VIEWS } from '../../constants/sectors';
import { useAuthStore } from '../../store/authStore';
import { SectorSheet } from '../../components/map/SectorSheet';
import { Mapbox3DWebView } from '../../components/map/Mapbox3DWebView';
import * as Haptics from 'expo-haptics';

export default function DigitalTwinMapScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const sectorId = user?.sectorId || 'SEC_MVP';
  const sectorView = SECTOR_MAP_VIEWS[sectorId] || SECTOR_MAP_VIEWS.ALL;

  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGPSLocation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      {/* 3D Mapbox GL Digital Twin View */}
      <Mapbox3DWebView sectorView={sectorView} selectedFilter={selectedFilter} />

      {/* Top Floating Controls Header */}
      <View style={[styles.topHeaderContainer, { paddingTop: insets.top + 10 }]}>
        {/* Floating Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Sector, Ward, Pipeline, Valve..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Sector Tag & Quick Map Actions Row */}
        <View style={styles.controlsRow}>
          <View style={styles.sectorBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.sectorBadgeText}>
              {user?.wardNumber || 'WARD 42'} · {user?.sectorName || 'MVP COLONY'}
            </Text>
          </View>

          <View style={styles.actionsGroup}>
            <TouchableOpacity onPress={handleGPSLocation} style={styles.iconBtn}>
              <Navigation size={16} color={Colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRefresh} style={styles.iconBtn}>
              <RefreshCw size={16} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Collapsible Apple Maps-Style Sector Control Overlay */}
      <SectorSheet
        sector={{
          id: sectorId,
          name: user?.sectorName || 'MVP Colony Sector',
          zone: user?.zone || 'Zone 2',
          adminEmail: 'mvp@gvmc.gov.in',
          centerLat: sectorView.center[0],
          centerLon: sectorView.center[1],
          contactPhone: '+91 891 250002',
          wards: ['42'],
          localities: ['MVP Colony', 'Siripuram'],
        }}
        activeFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D19',
  },
  topHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 900,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textInverse,
    fontSize: 14,
    marginLeft: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
    marginRight: 8,
  },
  sectorBadgeText: {
    ...Typography.label,
    color: Colors.secondary,
    fontWeight: '800',
    fontSize: 11,
  },
  actionsGroup: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
