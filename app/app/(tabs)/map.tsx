import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layers, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';
import { MAP_NODES, MAP_PIPES, SECTOR_MAP_VIEWS } from '../../constants/sectors';
import { MAPBOX_ACCESS_TOKEN } from '../../constants/api';
import { useAuthStore } from '../../store/authStore';
import { MapMarker } from '../../components/map/MapMarker';
import { SectorSheet } from '../../components/map/SectorSheet';
import { Mapbox3DWebView } from '../../components/map/Mapbox3DWebView';
import { useQuery } from '@tanstack/react-query';
import { networkService } from '../../services/networkService';
import { complaintService } from '../../services/complaintService';

const { width, height } = Dimensions.get('window');

export default function DigitalTwinMapScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const sectorId = user?.sectorId || 'SEC_MVP';
  const sectorView = SECTOR_MAP_VIEWS[sectorId] || SECTOR_MAP_VIEWS.ALL;

  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const { data: nodesData } = useQuery({
    queryKey: ['networkNodes'],
    queryFn: () => networkService.getNodes(),
    refetchInterval: 10000,
  });

  const { data: complaintsData } = useQuery({
    queryKey: ['sectorComplaints', sectorId],
    queryFn: () => complaintService.listComplaints(sectorId),
  });

  const complaints = complaintsData?.data || [];

  return (
    <View style={styles.container}>
      {/* 3D Mapbox GL Digital Twin View Bypassing Google Maps */}
      <Mapbox3DWebView sectorView={sectorView} selectedFilter={selectedFilter} />

      {/* Top Floating Header Controls */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.badgeContainer}>
          <View style={styles.liveDot} />
          <Text style={styles.badgeText}>VISAKHAPATNAM DIGITAL TWIN · {user?.sectorName || 'MVP COLONY'}</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn}>
          <RefreshCw size={16} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Sector Control Overlay */}
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
    backgroundColor: '#070d19',
  },
  topHeader: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 900,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 13, 25, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00e5ff',
    marginRight: 8,
  },
  badgeText: {
    ...Typography.caption2,
    color: Colors.accent,
    fontWeight: '800',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(7, 13, 25, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
