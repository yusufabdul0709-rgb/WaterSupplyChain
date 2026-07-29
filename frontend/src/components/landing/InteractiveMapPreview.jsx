import React, { useState } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Layers, ShieldCheck, Cpu, Droplets, MapPin, ArrowRight } from 'lucide-react';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';

import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
if (typeof window !== 'undefined') {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

// Futuristic 3D Glowing Node Marker Icon Matching Screenshot Reference
const Preview3DIcon = ({ label, iconSymbol, isAlert }) => {
  const bgColor = isAlert 
    ? 'radial-gradient(circle, #ef4444 0%, rgba(30,10,15,0.95) 80%)' 
    : 'radial-gradient(circle, #00e5ff 0%, rgba(10,25,47,0.95) 80%)';
  const borderColor = isAlert ? '#ef4444' : '#00e5ff';
  const glowShadow = isAlert 
    ? '0 0 20px #ef4444, 0 0 35px rgba(239, 68, 68, 0.8)' 
    : '0 0 15px #00e5ff, 0 0 25px rgba(0, 229, 255, 0.6)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', pointerEvents: 'auto' }}>
      <div style={{
        background: bgColor,
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '2px solid #ffffff',
        boxShadow: glowShadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 800,
        fontSize: '15px',
        textShadow: '0 1px 3px rgba(0,0,0,0.9)',
        transition: 'transform 0.2s ease'
      }}>
        {iconSymbol || '💧'}
      </div>
      {label && (
        <div style={{
          background: 'rgba(11, 22, 44, 0.92)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '100px',
          fontSize: '11px',
          fontWeight: 700,
          marginTop: '5px',
          border: `1px solid ${borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.3px'
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

const InteractiveMapPreview = ({ onOpenDigitalTwin, t }) => {
  const [popupInfo, setPopupInfo] = useState(null);

  // Key Visakhapatnam Telemetry Nodes Matching Reference Screenshot
  const previewNodes = [
    { id: 'gajuwaka', name: 'Old Gajuwaka', coords: [17.685, 83.215], color: '#00e5ff', symbol: '💧', status: 'Continuous 24/7 Supply', isAlert: false },
    { id: 'simhachalam', name: 'Simhachalam', coords: [17.755, 83.250], color: '#00e5ff', symbol: '💧', status: 'Hill Reservoir Active', isAlert: false },
    { id: 'gopalapatnam', name: 'Gopalapatnam HQ Hub', coords: [17.730, 83.280], color: '#ef4444', symbol: '⚠️', status: 'Pressure Anomaly Detected • Sector 4', isAlert: true },
    { id: 'siripuram', name: 'Siripuram Junction', coords: [17.720, 83.315], color: '#00e5ff', symbol: '💧', status: 'Optimal Flow • 2.4 m/s', isAlert: false },
    { id: 'mvp', name: 'MVP Colony', coords: [17.738, 83.332], color: '#00e5ff', symbol: '💧', status: 'Pressurized Grid Healthy', isAlert: false },
    { id: 'rushikonda', name: 'Rushikonda', coords: [17.765, 83.355], color: '#00e5ff', symbol: '💧', status: 'Coastal Line 7.4 pH', isAlert: false },
    { id: 'madhurawada', name: 'Madhurawada', coords: [17.815, 83.365], color: '#00e5ff', symbol: '💧', status: 'North Feeder Operational', isAlert: false },
  ];

  // Connecting Pipelines Matching Screenshot
  const pipelines = [
    { from: [17.685, 83.215], to: [17.730, 83.280], name: 'West Trunk Main' },
    { from: [17.755, 83.250], to: [17.730, 83.280], name: 'Simhachalam Gravity Line' },
    { from: [17.755, 83.250], to: [17.720, 83.315], name: 'Inland Bypass Grid' },
    { from: [17.730, 83.280], to: [17.720, 83.315], name: 'Central Distribution Feeder' },
    { from: [17.720, 83.315], to: [17.738, 83.332], name: 'Waltair Coastal Main' },
    { from: [17.738, 83.332], to: [17.765, 83.355], name: 'Rushikonda Extension Line' },
    { from: [17.765, 83.355], to: [17.815, 83.365], name: 'North Madhurawada Trunk' },
  ];

  const pipelinesGeoJSON = {
    type: 'FeatureCollection',
    features: pipelines.map((pipe, idx) => ({
      type: 'Feature',
      properties: { id: idx, name: pipe.name },
      geometry: {
        type: 'LineString',
        coordinates: [
          [pipe.from[1], pipe.from[0]], // [lon, lat]
          [pipe.to[1], pipe.to[0]]
        ]
      }
    }))
  };

  const alertZoneGeoJSON = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [83.280, 17.730] }
  };

  return (
    <section id="map-preview-section" className="landing-section">
      <div className="section-header">
        <div className="section-badge">{t?.mapBadge || "Live Telemetry Preview"}</div>
        <h2 className="section-title">{t?.mapTitle || "GVMC Interactive Map"}</h2>
        <p className="section-subtitle">
          {t?.mapSubtitle || "Explore Visakhapatnam's real-time water distribution network, reservoir capacities, and SCADA-monitored pump stations across the smart city grid."}
        </p>
      </div>

      <GlassCard style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Control Bar of Map Card */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--gvmc-success)',
              boxShadow: '0 0 0 4px rgba(0, 200, 83, 0.2)'
            }} />
            <span style={{ fontWeight: 700, color: 'var(--gvmc-text)', fontSize: '1rem' }}>
              Digital Twin Telemetry Feed: Visakhapatnam (HQ)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: 'rgba(0, 91, 172, 0.08)', color: 'var(--gvmc-primary)', padding: '6px 12px', borderRadius: '100px', fontWeight: 600 }}>
              <Droplets size={14} /> 8 Major Reservoirs
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: 'rgba(0, 184, 217, 0.08)', color: 'var(--gvmc-accent)', padding: '6px 12px', borderRadius: '100px', fontWeight: 600 }}>
              <Cpu size={14} /> 14 Pumping Stations
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--gvmc-success)', padding: '6px 12px', borderRadius: '100px', fontWeight: 600 }}>
              <ShieldCheck size={14} /> 215 IoT Sensors
            </span>
          </div>
        </div>

        {/* Mapbox Map Preview Area */}
        <div style={{
          height: '560px',
          width: '100%',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 91, 172, 0.18)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          position: 'relative'
        }}>
          <Map
            onLoad={(e) => {
              const map = e.target;
              try {
                map.setConfigProperty('basemap', 'lightPreset', 'night');
                map.setConfigProperty('basemap', 'showPointOfInterests', true);
                map.setConfigProperty('basemap', 'showPlaceLabels', true);
              } catch (err) {
                console.log('Standard basemap config:', err);
              }
            }}
            initialViewState={{
              longitude: 83.2900,
              latitude: 17.7400,
              zoom: 12,
              pitch: 60, // 3D Smart City perspective like Google Maps
              bearing: -20
            }}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/standard"
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
          >
            <NavigationControl position="top-right" />

            {/* Pulsing Zone Circle on Alert Node */}
            <Source id="alert-zone-source" type="geojson" data={alertZoneGeoJSON}>
              <Layer
                id="alert-zone-layer"
                type="circle"
                paint={{
                  'circle-radius': 35,
                  'circle-color': '#ef4444',
                  'circle-opacity': 0.2,
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#ef4444',
                  'circle-stroke-opacity': 0.8
                }}
              />
            </Source>

            {/* Outer Glow for Pipelines */}
            <Source id="pipelines-glow-source" type="geojson" data={pipelinesGeoJSON}>
              <Layer
                id="pipelines-glow-layer"
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
            <Source id="pipelines-source" type="geojson" data={pipelinesGeoJSON}>
              <Layer
                id="pipelines-layer"
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

            {/* Render 3D Glowing Nodes */}
            {previewNodes.map((node) => (
              <Marker
                key={node.id}
                longitude={node.coords[1]}
                latitude={node.coords[0]}
                anchor="center"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(node);
                }}
              >
                <Preview3DIcon label={node.name} iconSymbol={node.symbol} isAlert={node.isAlert} />
              </Marker>
            ))}

            {/* Popup on click */}
            {popupInfo && (
              <Popup
                longitude={popupInfo.coords[1]}
                latitude={popupInfo.coords[0]}
                anchor="bottom"
                onClose={() => setPopupInfo(null)}
                closeButton={true}
                closeOnClick={true}
                offset={25}
                style={{ zIndex: 100 }}
              >
                <div style={{ minWidth: '180px', padding: '6px', color: '#070d19' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 4px 0', color: popupInfo.isAlert ? '#ef4444' : '#005BAC' }}>
                    {popupInfo.name}
                  </h4>
                  <p style={{ fontSize: '12px', margin: 0, color: '#334155', fontWeight: 600 }}>
                    Status: <strong style={{ color: popupInfo.isAlert ? '#ef4444' : '#10B981' }}>{popupInfo.status}</strong>
                  </p>
                </div>
              </Popup>
            )}
          </Map>

          {/* Screenshot Reference MLD Telemetry Card Overlay */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
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
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
              pointerEvents: 'auto'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Surface Water</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00e5ff' }}>89.5 MLD</div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Groundwater</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>193.5 MLD</div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px', fontWeight: 600 }}>Water Balance</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>1.09 Ratio</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(11, 22, 44, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '14px 20px',
              fontSize: '0.9rem',
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

        {/* Bottom Call to Action */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
          <GlassButton
            variant="primary"
            icon={ArrowRight}
            onClick={onOpenDigitalTwin}
            style={{ padding: '16px 40px', fontSize: '1.05rem', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0, 91, 172, 0.3)' }}
          >
            {t?.openDigitalTwin || "Open Full Digital Twin"}
          </GlassButton>
        </div>

      </GlassCard>
    </section>
  );
};

export default InteractiveMapPreview;
