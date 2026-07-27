import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layers, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';
import { MAP_NODES, MAP_PIPES, SECTOR_MAP_VIEWS } from '../../constants/sectors';
import { MAPBOX_ACCESS_TOKEN } from '../../constants/api';
import { useAuthStore } from '../../store/authStore';
import { MapMarker } from '../../components/map/MapMarker';
import { SectorSheet } from '../../components/map/SectorSheet';
import { useQuery } from '@tanstack/react-query';
import { networkService } from '../../services/networkService';
import { complaintService } from '../../services/complaintService';

const { width, height } = Dimensions.get('window');

// Custom dark map style matching Mapbox dark preset from admin dashboard
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#070d19' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#00e5ff' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2638' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#031428' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
];

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

  // Use CartoDB Dark Matter tiles (identical aesthetic to Mapbox Dark, 100% reliable on Android without Referer header restrictions)
  const tileUrl = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        mapType="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: '#070d19' }]}
        minZoomLevel={11}
        maxZoomLevel={18}
        mapBoundaries={{
          northEast: { latitude: 17.95, longitude: 83.50 },
          southWest: { latitude: 17.55, longitude: 83.05 },
        }}
        initialRegion={{
          latitude: sectorView.center[0],
          longitude: sectorView.center[1],
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        {/* Digital Twin Dark Base Tiles */}
        <UrlTile
          urlTemplate={tileUrl}
          maximumZ={19}
          flipY={false}
          zIndex={-1}
        />
        {/* Animated Dashed Water Flow Pipes */}
        {MAP_PIPES.map((pipe, index) => (
          <Polyline
            key={`pipe_${index}`}
            coordinates={[
              { latitude: pipe.from[0], longitude: pipe.from[1] },
              { latitude: pipe.to[0], longitude: pipe.to[1] },
            ]}
            strokeColor="#00e5ff"
            strokeWidth={3}
            lineDashPattern={[6, 4]}
            zIndex={10}
          />
        ))}

        {/* Localized Digital Twin Sector Node Markers */}
        {MAP_NODES.map((node) => {
          if (selectedFilter === 'RESERVOIR' && node.type !== 'reservoir') return null;
          if (selectedFilter === 'PUMP' && node.type !== 'pump') return null;

          return (
            <Marker
              key={node.id}
              coordinate={{ latitude: node.lat, longitude: node.lon }}
              title={node.name}
              description={`Flow: ${node.flow} · SLA: ${node.eff}`}
              zIndex={20}
            >
              <MapMarker name={node.name} type={node.type as any} />
            </Marker>
          );
        })}

        {/* Nearby Complaint Alert Markers */}
        {(selectedFilter === 'ALL' || selectedFilter === 'ISSUES') &&
          complaints.map((c) => (
            <Marker
              key={`cmp_${c.id}`}
              coordinate={{ latitude: c.lat || 17.738, longitude: c.lon || c.lng || 83.332 }}
              title={`Complaint #${c.id}`}
              description={c.description}
            >
              <MapMarker name={`#${c.id}`} type="junction" isAlert={true} />
            </Marker>
          ))}
      </MapView>

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
