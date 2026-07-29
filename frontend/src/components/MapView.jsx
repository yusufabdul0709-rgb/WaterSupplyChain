import React, { useEffect, useRef, useState } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
if (typeof window !== 'undefined') {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

// Sleek 3D Micro Icon Marker
const Custom3DIcon = ({ text, isAlert, glowColor }) => {
  const bgColor = isAlert 
    ? 'radial-gradient(circle, #ef4444 0%, rgba(30,10,15,0.95) 80%)' 
    : glowColor 
      ? `radial-gradient(circle, ${glowColor} 0%, rgba(10,25,47,0.95) 80%)`
      : 'radial-gradient(circle, #00e5ff 0%, rgba(10,25,47,0.95) 80%)';
  
  const glowShadow = isAlert 
    ? '0 0 18px #ef4444, 0 0 30px rgba(239, 68, 68, 0.8)' 
    : glowColor
      ? `0 0 16px ${glowColor}, 0 0 26px ${glowColor}88`
      : '0 0 15px #00e5ff, 0 0 25px rgba(0, 229, 255, 0.6)';

  return (
    <div style={{
      background: bgColor,
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: '2px solid #ffffff',
      boxShadow: glowShadow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '13px',
      textShadow: '0 1px 3px rgba(0,0,0,0.9)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
    }}>
      {text || '💧'}
    </div>
  );
};

const SECTOR_COORDS = {
  ALL: { center: [17.740, 83.290], zoom: 12 },
  SEC_GAJUWAKA: { center: [17.6850, 83.2150], zoom: 14 },
  SEC_MVP: { center: [17.7380, 83.3320], zoom: 14 },
  SEC_SEETHAM: { center: [17.7400, 83.3050], zoom: 14 },
  SEC_MADHURA: { center: [17.8150, 83.3650], zoom: 14 },
  SEC_ANAKAPALLE: { center: [17.6900, 83.0000], zoom: 13 },
};

const MapView = ({ selectedSector, complaints, mode = 'dashboard' }) => {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const targetSectorConfig = SECTOR_COORDS[selectedSector] || SECTOR_COORDS.ALL;

  // Key Visakhapatnam Network Nodes
  const allNodes = [
    { id: 'N1', name: 'Old Gajuwaka Main', lat: 17.685, lon: 83.215, type: 'reservoir', sector: 'SEC_GAJUWAKA', flow: '4,500 L/s', pressure: '5.8 bar', ph: 6.4, phStatus: 'Mild Acidic', capacity: '88%', vol: '8.5 ML', power: '120 kW', eff: '98%', isAlert: false },
    { id: 'N2', name: 'Simhachalam Hill Tank', lat: 17.755, lon: 83.250, type: 'tank', sector: 'SEC_SEETHAM', flow: '3,100 L/s', pressure: '6.2 bar', ph: 7.2, phStatus: 'Clean', capacity: '94%', vol: '4.2 ML', power: '85 kW', eff: '94%', isAlert: false },
    { id: 'N3', name: 'Gopalapatnam Command Hub', lat: 17.730, lon: 83.280, type: 'pump', sector: 'SEC_SEETHAM', flow: '1,850 L/s', pressure: '4.1 bar', ph: 7.1, phStatus: 'Clean', capacity: '72%', vol: '3.1 ML', power: '145 kW (1450 RPM)', eff: '82%', isAlert: true },
    { id: 'N4', name: 'Siripuram Junction Node', lat: 17.720, lon: 83.315, type: 'junction', sector: 'SEC_MVP', flow: '3,312 L/s', pressure: '5.4 bar', ph: 7.4, phStatus: 'Optimal', capacity: '81%', vol: '2.8 ML', power: '90 kW', eff: '89%', isAlert: false },
    { id: 'N5', name: 'MVP Colony Grid Hub', lat: 17.738, lon: 83.332, type: 'reservoir', sector: 'SEC_MVP', flow: '5,200 L/s', pressure: '6.5 bar', ph: 7.5, phStatus: 'Optimal', capacity: '92%', vol: '12.0 ML', power: '210 kW', eff: '95%', isAlert: false },
    { id: 'N6', name: 'Rushikonda Coastal Station', lat: 17.765, lon: 83.355, type: 'tank', sector: 'SEC_MADHURA', flow: '2,400 L/s', pressure: '4.8 bar', ph: 8.8, phStatus: 'High Alkaline', capacity: '78%', vol: '5.5 ML', power: '110 kW', eff: '91%', isAlert: false },
    { id: 'N7', name: 'Madhurawada North Reservoir', lat: 17.815, lon: 83.365, type: 'tank', sector: 'SEC_MADHURA', flow: '4,100 L/s', pressure: '5.9 bar', ph: 7.3, phStatus: 'Optimal', capacity: '85%', vol: '6.8 ML', power: '135 kW', eff: '93%', isAlert: false },
  ];

  // Pipeline Geometries
  const pipes = [
    { coords: [[17.685, 83.215], [17.730, 83.280]], phColor: '#f59e0b', phLabel: 'pH 6.4 (Acidic)', flowLabel: '4,500 L/s' },
    { coords: [[17.755, 83.250], [17.730, 83.280]], phColor: '#00e5ff', phLabel: 'pH 7.2 (Clean)', flowLabel: '3,100 L/s' },
    { coords: [[17.755, 83.250], [17.720, 83.315]], phColor: '#10b981', phLabel: 'pH 7.4 (Optimal)', flowLabel: '3,300 L/s' },
    { coords: [[17.730, 83.280], [17.720, 83.315]], phColor: '#ef4444', phLabel: 'pH 5.8 (Warning)', flowLabel: '1,850 L/s (Leak Risk)' },
    { coords: [[17.720, 83.315], [17.738, 83.332]], phColor: '#10b981', phLabel: 'pH 7.5 (Optimal)', flowLabel: '5,200 L/s' },
    { coords: [[17.738, 83.332], [17.765, 83.355]], phColor: '#a855f7', phLabel: 'pH 8.8 (Alkaline)', flowLabel: '2,400 L/s' },
    { coords: [[17.765, 83.355], [17.815, 83.365]], phColor: '#00e5ff', phLabel: 'pH 7.3 (Clean)', flowLabel: '4,100 L/s' },
  ];

  // Filter nodes & complaints by selected sector
  const filteredNodes = selectedSector === 'ALL' ? allNodes : allNodes.filter(n => n.sector === selectedSector || selectedSector.includes(n.sector.replace('SEC_', '')));
  const filteredComplaints = selectedSector === 'ALL' ? complaints : (complaints || []).filter(c => c.sector_id === selectedSector || selectedSector.includes((c.sector_id || '').replace('SEC_', '')));

  // Smooth camera flyTo when sector changes
  useEffect(() => {
    if (mapRef.current && targetSectorConfig) {
      mapRef.current.flyTo({
        center: [targetSectorConfig.center[1], targetSectorConfig.center[0]],
        zoom: targetSectorConfig.zoom,
        pitch: 60,
        bearing: -20,
        duration: 1500,
        essential: true
      });
    }
  }, [selectedSector]);

  // GeoJSON LineStrings for Mapbox pipelines
  const pipesGeoJSON = {
    type: 'FeatureCollection',
    features: pipes.map((pipe, idx) => ({
      type: 'Feature',
      properties: {
        id: idx,
        phColor: pipe.phColor,
        phLabel: pipe.phLabel,
        flowLabel: pipe.flowLabel,
        isWarning: idx === 3,
      },
      geometry: {
        type: 'LineString',
        coordinates: pipe.coords.map(([lat, lon]) => [lon, lat])
      }
    }))
  };

  const onMapLoad = (e) => {
    const map = e.target;
    try {
      map.setConfigProperty('basemap', 'lightPreset', 'night');
      map.setConfigProperty('basemap', 'showPointOfInterests', true);
      map.setConfigProperty('basemap', 'showPlaceLabels', true);
    } catch (err) {
      console.log('Standard basemap configuration:', err);
    }
  };

  // Header overlay cards for each domain mode
  const renderHeaderOverlay = () => {
    switch (mode) {
      case 'network_map':
        return (
          <div style={{ background: 'rgba(11, 22, 44, 0.94)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)', pointerEvents: 'auto' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>City Water Flow</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00e5ff' }}>21,762 L/s</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Flow Velocity</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>2.4 m/s</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Pipeline Efficiency</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>98.2% Optimal</div>
            </div>
          </div>
        );

      case 'pumping_stations':
        return (
          <div style={{ background: 'rgba(11, 22, 44, 0.94)', backdropFilter: 'blur(12px)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)', pointerEvents: 'auto' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Active Pump Stations</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#facc15' }}>14 / 14 Online</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Avg Pump Pressure</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00e5ff' }}>6.2 bar</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Total Power Draw</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>450 kW</div>
            </div>
          </div>
        );

      case 'reservoirs':
        return (
          <div style={{ background: 'rgba(11, 22, 44, 0.94)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)', pointerEvents: 'auto' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Storage Capacity</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>84.5 MG</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Live Reserve Level</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>78.2% Full</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Net Intake Rate</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00e5ff' }}>+600 L/s</div>
            </div>
          </div>
        );

      case 'water_quality':
        return (
          <div style={{ background: 'rgba(11, 22, 44, 0.94)', backdropFilter: 'blur(12px)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)', pointerEvents: 'auto' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Avg System pH</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>7.35 pH</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Water Quality Index</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00e5ff' }}>98.6% Optimal</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Contamination</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>0.0% Clean</div>
            </div>
          </div>
        );

      case 'leak_intelligence':
        return (
          <div style={{ background: 'rgba(11, 22, 44, 0.94)', backdropFilter: 'blur(12px)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)', pointerEvents: 'auto' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>AI Rupture Risk</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>1 Sector Warning</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>NRW Water Loss</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#facc15' }}>14.8% (Target &lt;10%)</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>System Health Score</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>94% Safe</div>
            </div>
          </div>
        );

      case 'dashboard':
      case 'command':
      default:
        return (
          <div style={{ background: 'rgba(11, 22, 44, 0.92)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)', pointerEvents: 'auto' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Surface Water</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00e5ff' }}>89.5 MLD</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Groundwater</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>193.5 MLD</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Water Balance</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>1.09 Ratio</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0, 229, 255, 0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        initialViewState={{
          longitude: targetSectorConfig.center[1],
          latitude: targetSectorConfig.center[0],
          zoom: targetSectorConfig.zoom,
          pitch: 60,
          bearing: -20
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/standard"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Dynamic Pipeline Vector Stream Layers */}
        <Source id="pipes-glow-source" type="geojson" data={pipesGeoJSON}>
          <Layer
            id="pipes-glow-layer"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': mode === 'water_quality' 
                ? ['get', 'phColor']
                : mode === 'leak_intelligence'
                  ? ['case', ['get', 'isWarning'], '#ef4444', '#00e5ff']
                  : '#00e5ff',
              'line-width': mode === 'network_map' ? 14 : 8,
              'line-opacity': mode === 'network_map' ? 0.35 : 0.25,
              'line-blur': mode === 'network_map' ? 4 : 3
            }}
          />
        </Source>

        <Source id="pipes-source" type="geojson" data={pipesGeoJSON}>
          <Layer
            id="pipes-layer"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': mode === 'water_quality' 
                ? ['get', 'phColor']
                : mode === 'leak_intelligence'
                  ? ['case', ['get', 'isWarning'], '#ef4444', '#00e5ff']
                  : mode === 'network_map'
                    ? '#38bdf8'
                    : '#00e5ff',
              'line-width': mode === 'network_map' ? 4.5 : 3.5,
              'line-opacity': 0.95,
              'line-dasharray': mode === 'network_map' ? [4, 4] : [2, 2]
            }}
          />
        </Source>

        {/* ── MODE 1: Pumping Stations — Sleek Micro Badge Alignment ── */}
        {mode === 'pumping_stations' && filteredNodes.map((node) => (
          <Marker key={node.id} longitude={node.lon} latitude={node.lat} anchor="center">
            <div
              style={{
                background: 'rgba(7, 13, 25, 0.92)',
                backdropFilter: 'blur(10px)',
                border: node.isAlert ? '1.5px solid #ef4444' : '1.5px solid #facc15',
                borderRadius: '20px',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: node.isAlert ? '0 0 16px rgba(239, 68, 68, 0.6)' : '0 0 12px rgba(250, 204, 21, 0.4)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ type: 'node', data: node, lon: node.lon, lat: node.lat });
              }}
            >
              <span style={{ fontSize: '15px', animation: 'map-rotate-pump 2.5s linear infinite', display: 'inline-block' }}>⚙️</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap' }}>{node.name}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#00e5ff', background: 'rgba(0,229,255,0.15)', padding: '1px 6px', borderRadius: '8px' }}>{node.pressure}</span>
            </div>
          </Marker>
        ))}

        {/* ── MODE 2: Reservoirs & Tanks — Sleek Micro Badge Alignment ── */}
        {mode === 'reservoirs' && filteredNodes.map((node) => (
          <Marker key={node.id} longitude={node.lon} latitude={node.lat} anchor="center">
            <div
              style={{
                background: 'rgba(7, 13, 25, 0.92)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid #0ea5e9',
                borderRadius: '20px',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 12px rgba(14, 165, 233, 0.4)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ type: 'node', data: node, lon: node.lon, lat: node.lat });
              }}
            >
              <span style={{ fontSize: '14px' }}>🛢️</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap' }}>{node.name}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '1px 6px', borderRadius: '8px' }}>{node.capacity}</span>
            </div>
          </Marker>
        ))}

        {/* ── MODE 3: Water Quality pH — Sleek Micro Pill Alignment ── */}
        {mode === 'water_quality' && filteredNodes.map((node) => {
          const phColor = node.ph < 6.5 ? '#f59e0b' : node.ph > 8.5 ? '#a855f7' : '#10b981';
          return (
            <Marker key={node.id} longitude={node.lon} latitude={node.lat} anchor="center">
              <div
                style={{
                  background: 'rgba(7, 13, 25, 0.92)',
                  backdropFilter: 'blur(10px)',
                  border: `1.5px solid ${phColor}`,
                  borderRadius: '16px',
                  padding: '3px 8px',
                  boxShadow: `0 0 12px ${phColor}66`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#ffffff'
                }}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo({ type: 'node', data: node, lon: node.lon, lat: node.lat });
                }}
              >
                <span>🧪</span>
                <span>pH {node.ph}</span>
                <span style={{ fontSize: '0.6rem', color: phColor, background: `${phColor}22`, padding: '1px 5px', borderRadius: '8px' }}>
                  {node.phStatus}
                </span>
              </div>
            </Marker>
          );
        })}

        {/* ── MODE 4: Water Network Map — Pure Vector Flow Network ── */}
        {mode === 'network_map' && filteredNodes.map((node) => (
          <Marker key={node.id} longitude={node.lon} latitude={node.lat} anchor="center">
            <div
              style={{ cursor: 'pointer' }}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ type: 'node', data: node, lon: node.lon, lat: node.lat });
              }}
            >
              <Custom3DIcon text="💧" isAlert={false} glowColor="#00e5ff" />
            </div>
          </Marker>
        ))}

        {/* ── MODE 5: Leak Intelligence — Clean Warning Rings ─────── */}
        {mode === 'leak_intelligence' && filteredNodes.map((node) => (
          <Marker key={node.id} longitude={node.lon} latitude={node.lat} anchor="center">
            <div
              style={{
                borderRadius: '50%',
                animation: node.isAlert ? 'map-pulse-leak 1.5s ease-in-out infinite' : 'none',
                cursor: 'pointer'
              }}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ type: 'node', data: node, lon: node.lon, lat: node.lat });
              }}
            >
              <Custom3DIcon text={node.isAlert ? '⚠️' : '💧'} isAlert={node.isAlert} />
            </div>
          </Marker>
        ))}

        {/* ── DEFAULT / DASHBOARD OVERVIEW MODE ────────────────────── */}
        {(mode === 'dashboard' || mode === 'command') && filteredNodes.map((node) => (
          <Marker
            key={node.id}
            longitude={node.lon}
            latitude={node.lat}
            anchor="center"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo({ type: 'node', data: node, lon: node.lon, lat: node.lat });
            }}
          >
            <Custom3DIcon text={node.isAlert ? '⚠️' : '💧'} isAlert={node.isAlert} />
          </Marker>
        ))}

        {/* Citizen Complaints Markers */}
        {(filteredComplaints || []).map((c) => {
          const lon = c.lon || c.lng || 83.28;
          const lat = c.lat || 17.72;
          return (
            <Marker
              key={c.id}
              longitude={lon}
              latitude={lat}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo({ type: 'complaint', data: c, lon, lat });
              }}
            >
              <Custom3DIcon text="🚨" isAlert={true} />
            </Marker>
          );
        })}

        {/* Interactive Popup on Marker Click */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.lon}
            latitude={popupInfo.lat}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={true}
            offset={20}
            style={{ zIndex: 100 }}
          >
            <div style={{ color: '#070d19', padding: '6px', minWidth: '170px' }}>
              {popupInfo.type === 'node' ? (
                <>
                  <strong style={{ fontSize: '14px', color: popupInfo.data.isAlert ? '#ef4444' : '#005BAC' }}>
                    {popupInfo.data.name}
                  </strong><br />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Sector: {popupInfo.data.sector}</span><br />
                  <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600 }}>
                    Flow Rate: <span style={{ color: '#005BAC' }}>{popupInfo.data.flow}</span><br />
                    Pressure: <span style={{ color: '#00e5ff' }}>{popupInfo.data.pressure}</span><br />
                    pH Value: <span style={{ color: '#10b981' }}>{popupInfo.data.ph} ({popupInfo.data.phStatus})</span>
                  </div>
                </>
              ) : (
                <>
                  <strong style={{ color: '#dc2626', fontSize: '13px' }}>🚨 Citizen Complaint: #{popupInfo.data.id}</strong><br />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Issue: {popupInfo.data.issue_type || popupInfo.data.description}</span><br />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Citizen: {popupInfo.data.citizen_name || popupInfo.data.user_name || 'Citizen'} ({popupInfo.data.phone})</span><br />
                  <span style={{ fontSize: '11px', color: '#005BAC' }}>Sector: {popupInfo.data.sector_name || popupInfo.data.sector_id}</span>
                </>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Header Telemetry Card Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        pointerEvents: 'none'
      }}>
        {renderHeaderOverlay()}

        <div style={{
          background: 'rgba(11, 22, 44, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '12px 18px',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#f8fafc',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto'
        }}>
          <span style={{ width: '8px', height: '8px', background: mode === 'water_quality' ? '#10b981' : mode === 'leak_intelligence' ? '#ef4444' : '#00e5ff', borderRadius: '50%', boxShadow: `0 0 8px ${mode === 'water_quality' ? '#10b981' : mode === 'leak_intelligence' ? '#ef4444' : '#00e5ff'}` }} />
          {mode === 'water_quality' ? 'pH Monitoring Network' : mode === 'pumping_stations' ? 'Pumping Operations' : mode === 'reservoirs' ? 'Storage Network' : mode === 'leak_intelligence' ? 'AI Leak Monitor' : 'in Distribution Pipeline'}
        </div>
      </div>
    </div>
  );
};

export default MapView;
