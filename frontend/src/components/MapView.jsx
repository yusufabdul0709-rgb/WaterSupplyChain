import React, { useEffect, useRef, useState } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Custom Glowing 3D Map Markers Matching Reference Screenshot
const Custom3DIcon = ({ text, isAlert }) => {
  const bgColor = isAlert 
    ? 'radial-gradient(circle, #ef4444 0%, rgba(30,10,15,0.95) 80%)' 
    : 'radial-gradient(circle, #00e5ff 0%, rgba(10,25,47,0.95) 80%)';
  const glowShadow = isAlert 
    ? '0 0 18px #ef4444, 0 0 30px rgba(239, 68, 68, 0.8)' 
    : '0 0 15px #00e5ff, 0 0 25px rgba(0, 229, 255, 0.6)';

  return (
    <div style={{
      background: bgColor,
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      border: '2px solid #ffffff',
      boxShadow: glowShadow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '14px',
      textShadow: '0 1px 3px rgba(0,0,0,0.9)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
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

const MapView = ({ selectedSector, complaints }) => {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const targetSectorConfig = SECTOR_COORDS[selectedSector] || SECTOR_COORDS.ALL;

  // Key Visakhapatnam Nodes Matching Reference Screenshot
  const allNodes = [
    { id: 'N1', name: 'Old Gajuwaka Main', lat: 17.685, lon: 83.215, type: 'reservoir', sector: 'SEC_GAJUWAKA', flow: '4,500 L/s', eff: '98%', isAlert: false },
    { id: 'N2', name: 'Simhachalam Hill Tank', lat: 17.755, lon: 83.250, type: 'tank', sector: 'SEC_SEETHAM', flow: '3,100 L/s', eff: '94%', isAlert: false },
    { id: 'N3', name: 'Gopalapatnam Command Hub', lat: 17.730, lon: 83.280, type: 'pump', sector: 'SEC_SEETHAM', flow: '1,850 L/s', eff: '82%', isAlert: true },
    { id: 'N4', name: 'Siripuram Junction Node', lat: 17.720, lon: 83.315, type: 'junction', sector: 'SEC_MVP', flow: '3,312 L/s', eff: '89%', isAlert: false },
    { id: 'N5', name: 'MVP Colony Grid Hub', lat: 17.738, lon: 83.332, type: 'reservoir', sector: 'SEC_MVP', flow: '5,200 L/s', eff: '95%', isAlert: false },
    { id: 'N6', name: 'Rushikonda Coastal Station', lat: 17.765, lon: 83.355, type: 'tank', sector: 'SEC_MADHURA', flow: '2,400 L/s', eff: '91%', isAlert: false },
    { id: 'N7', name: 'Madhurawada North Reservoir', lat: 17.815, lon: 83.365, type: 'tank', sector: 'SEC_MADHURA', flow: '4,100 L/s', eff: '93%', isAlert: false },
  ];

  // Dashed Cyan Pipelines Matching Screenshot
  const pipes = [
    [[17.685, 83.215], [17.730, 83.280]],
    [[17.755, 83.250], [17.730, 83.280]],
    [[17.755, 83.250], [17.720, 83.315]],
    [[17.730, 83.280], [17.720, 83.315]],
    [[17.720, 83.315], [17.738, 83.332]],
    [[17.738, 83.332], [17.765, 83.355]],
    [[17.765, 83.355], [17.815, 83.365]],
  ];

  // Filter nodes & complaints by selected sector if not ALL
  const filteredNodes = selectedSector === 'ALL' ? allNodes : allNodes.filter(n => n.sector === selectedSector || selectedSector.includes(n.sector.replace('SEC_', '')));
  const filteredComplaints = selectedSector === 'ALL' ? complaints : (complaints || []).filter(c => c.sector_id === selectedSector || selectedSector.includes((c.sector_id || '').replace('SEC_', '')));

  // Smooth camera flyTo when sector changes
  useEffect(() => {
    if (mapRef.current && targetSectorConfig) {
      mapRef.current.flyTo({
        center: [targetSectorConfig.center[1], targetSectorConfig.center[0]], // [lon, lat]
        zoom: targetSectorConfig.zoom,
        pitch: 60,
        bearing: -20,
        duration: 1500,
        essential: true
      });
    }
  }, [selectedSector]);

  // Convert pipes to GeoJSON LineStrings for Mapbox
  const pipesGeoJSON = {
    type: 'FeatureCollection',
    features: pipes.map((pipeCoords, idx) => ({
      type: 'Feature',
      properties: { id: idx },
      geometry: {
        type: 'LineString',
        coordinates: pipeCoords.map(([lat, lon]) => [lon, lat])
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0, 229, 255, 0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        initialViewState={{
          longitude: targetSectorConfig.center[1],
          latitude: targetSectorConfig.center[0],
          zoom: targetSectorConfig.zoom,
          pitch: 60, // 3D Smart City pitch like Google Maps
          bearing: -20
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/standard"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Outer Glow for Pipelines */}
        <Source id="pipes-glow-source" type="geojson" data={pipesGeoJSON}>
          <Layer
            id="pipes-glow-layer"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#00e5ff',
              'line-width': 8,
              'line-opacity': 0.25,
              'line-blur': 3
            }}
          />
        </Source>

        {/* Dashed Glowing Pipelines */}
        <Source id="pipes-source" type="geojson" data={pipesGeoJSON}>
          <Layer
            id="pipes-layer"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#00e5ff',
              'line-width': 3.5,
              'line-opacity': 0.95,
              'line-dasharray': [2, 2]
            }}
          />
        </Source>

        {/* Node Markers */}
        {filteredNodes.map((node) => (
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

        {/* Complaint Markers */}
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
                    Flow Rate: <span style={{ color: '#00e5ff' }}>{popupInfo.data.flow}</span><br />
                    SLA Efficiency: <span style={{ color: '#10b981' }}>{popupInfo.data.eff}</span>
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

      {/* Screenshot Reference MLD Telemetry Card Overlay in Dashboard */}
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
        <div style={{
          background: 'rgba(11, 22, 44, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
          pointerEvents: 'auto'
        }}>
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
          <span style={{ width: '8px', height: '8px', background: '#00e5ff', borderRadius: '50%', boxShadow: '0 0 8px #00e5ff' }} />
          in Distribution Pipeline
        </div>
      </div>
    </div>
  );
};

export default MapView;
