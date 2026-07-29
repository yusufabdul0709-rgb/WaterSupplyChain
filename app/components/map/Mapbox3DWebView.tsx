import React, { useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { MAPBOX_ACCESS_TOKEN } from '../../constants/api';
import { MAP_NODES, MAP_PIPES } from '../../constants/sectors';

interface Mapbox3DWebViewProps {
  sectorView: { center: [number, number]; zoom: number };
  selectedFilter?: string;
  onSelectNode?: (node: any) => void;
}

export function Mapbox3DWebView({ sectorView, selectedFilter = 'ALL', onSelectNode }: Mapbox3DWebViewProps) {
  const webViewRef = useRef<WebView>(null);

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <View style={[styles.container, styles.fallback]}>
        <Text style={styles.fallbackTitle}>⚠️ Map Access Token Required</Text>
        <Text style={styles.fallbackText}>
          Please set EXPO_PUBLIC_MAPBOX_TOKEN in .env to initialize Visakhapatnam 3D Water Network Digital Twin.
        </Text>
      </View>
    );
  }

  const filteredNodes = MAP_NODES.filter((node) => {
    if (selectedFilter === 'RESERVOIR') return node.type === 'reservoir';
    if (selectedFilter === 'PUMP') return node.type === 'pump';
    if (selectedFilter === 'VALVES') return node.type === 'junction';
    if (selectedFilter === 'SENSORS') return node.type === 'junction' || node.type === 'pump';
    if (selectedFilter === 'COMPLAINTS') return (node as any).isAlert;
    return true;
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #070d19; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%; }

    .custom-marker {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 2px solid #FFFFFF;
      display: flex; align-items: center; justify-content: center;
      color: #FFF; font-weight: 800; font-size: 16px;
      cursor: pointer;
      box-shadow: 0 0 15px #0EA5E9, 0 0 25px rgba(14, 165, 233, 0.6);
      background: radial-gradient(circle, #0EA5E9 0%, rgba(7, 13, 25, 0.95) 85%);
      transition: transform 0.2s ease-out;
    }
    .custom-marker:hover { transform: scale(1.15); }
    .custom-marker.alert {
      box-shadow: 0 0 18px #EF4444, 0 0 30px rgba(239, 68, 68, 0.8);
      background: radial-gradient(circle, #EF4444 0%, rgba(30, 10, 15, 0.95) 85%);
    }

    .mapboxgl-popup-content {
      background: rgba(15, 23, 42, 0.92) !important;
      color: #FFFFFF !important;
      border: 1px solid #0EA5E9;
      border-radius: 14px;
      padding: 12px 14px !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
    }
    .mapboxgl-popup-tip {
      border-top-color: rgba(15, 23, 42, 0.92) !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    try {
      mapboxgl.accessToken = '${MAPBOX_ACCESS_TOKEN}';
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [${sectorView.center[1]}, ${sectorView.center[0]}],
        zoom: 13.5,
        pitch: 55,
        bearing: -12,
        maxBounds: [[83.05, 17.55], [83.50, 17.95]],
        minZoom: 11,
        maxZoom: 18,
        antialias: true
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: false }), 'bottom-right');

      map.on('load', () => {
        // 3D Buildings
        try {
          const layers = map.getStyle().layers;
          const labelLayerId = layers.find(layer => layer.type === 'symbol' && layer.layout['text-field'])?.id;
          map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 13,
            'paint': {
              'fill-extrusion-color': '#0F172A',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.85
            }
          }, labelLayerId);
        } catch(e) {}

        // Pipelines GeoJSON
        const pipesData = ${JSON.stringify({
          type: 'FeatureCollection',
          features: MAP_PIPES.map((pipe, idx) => ({
            type: 'Feature',
            properties: { id: `pipe_${idx}` },
            geometry: {
              type: 'LineString',
              coordinates: [
                [pipe.from[1], pipe.from[0]],
                [pipe.to[1], pipe.to[0]],
              ],
            },
          })),
        })};

        map.addSource('pipes', { type: 'geojson', data: pipesData });

        // Pipe Glow Layer
        map.addLayer({
          'id': 'pipes-glow',
          'type': 'line',
          'source': 'pipes',
          'layout': { 'line-join': 'round', 'line-cap': 'round' },
          'paint': {
            'line-color': '#0EA5E9',
            'line-width': 8,
            'line-opacity': 0.35,
            'line-blur': 4
          }
        });

        // Animated Water Flow Dashed Line
        map.addLayer({
          'id': 'pipes-flow',
          'type': 'line',
          'source': 'pipes',
          'layout': { 'line-join': 'round', 'line-cap': 'round' },
          'paint': {
            'line-color': '#38BDF8',
            'line-width': 4.5,
            'line-dasharray': [2, 3]
          }
        });

        // Continuous Water Flow Animation Loop
        let dashStep = 0;
        function animateFlow() {
          dashStep = (dashStep + 0.15) % 10;
          if (map.getLayer('pipes-flow')) {
            map.setPaintProperty('pipes-flow', 'line-dasharray', [(2 + dashStep) % 5, 3]);
          }
          requestAnimationFrame(animateFlow);
        }
        animateFlow();

        // Node Markers
        const nodes = ${JSON.stringify(filteredNodes)};
        nodes.forEach(node => {
          const el = document.createElement('div');
          el.className = 'custom-marker' + (node.isAlert ? ' alert' : '');
          el.innerHTML = node.type === 'reservoir' ? '💧' : node.type === 'pump' ? '⚡' : node.isAlert ? '⚠️' : '⚙️';

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            '<div>' +
            '<strong style="color: #38BDF8; font-size: 14px;">' + node.name + '</strong>' +
            '<div style="margin-top: 6px; font-size: 12px; color: #94A3B8;">' +
            'Flow: <span style="color: #FFF; font-weight: 700;">' + node.flow + '</span><br/>' +
            'Efficiency: <span style="color: #22C55E; font-weight: 700;">' + node.eff + '</span>' +
            '</div>' +
            '</div>'
          );

          new mapboxgl.Marker(el)
            .setLngLat([node.lon, node.lat])
            .setPopup(popup)
            .addTo(map);
        });
      });
    } catch(err) {
      console.error(err);
    }
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent, baseUrl: 'https://api.mapbox.com' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0EA5E9" />
            <Text style={styles.loadingText}>Initializing Digital Twin Map...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#070D19',
  },
  webview: {
    flex: 1,
    backgroundColor: '#070D19',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 12,
  },
  fallbackText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#070D19',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '600',
  },
});
