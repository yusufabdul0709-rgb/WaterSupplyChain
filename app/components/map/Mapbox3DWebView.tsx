import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { MAPBOX_ACCESS_TOKEN } from '../../constants/api';
import { MAP_NODES, MAP_PIPES } from '../../constants/sectors';

interface Mapbox3DWebViewProps {
  sectorView: { center: [number, number]; zoom: number };
  selectedFilter?: string;
}

export function Mapbox3DWebView({ sectorView, selectedFilter = 'ALL' }: Mapbox3DWebViewProps) {
  const filteredNodes = MAP_NODES.filter((node) => {
    if (selectedFilter === 'RESERVOIR' && node.type !== 'reservoir') return false;
    if (selectedFilter === 'PUMP' && node.type !== 'pump') return false;
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
    body { margin: 0; padding: 0; background: #070d19; overflow: hidden; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
    .custom-marker {
      width: 34px; height: 34px;
      border-radius: 50%;
      border: 2px solid #fff;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 800; font-size: 15px; font-family: sans-serif;
      cursor: pointer;
      box-shadow: 0 0 15px #00e5ff, 0 0 25px rgba(0, 229, 255, 0.6);
      background: radial-gradient(circle, #00e5ff 0%, rgba(10,25,47,0.95) 80%);
      transition: transform 0.2s;
    }
    .custom-marker:hover { transform: scale(1.1); }
    .custom-marker.alert {
      box-shadow: 0 0 18px #ef4444, 0 0 30px rgba(239, 68, 68, 0.8);
      background: radial-gradient(circle, #ef4444 0%, rgba(30,10,15,0.95) 80%);
    }
    .mapboxgl-popup-content {
      background: rgba(15, 23, 42, 0.95) !important;
      color: #fff !important;
      border: 1px solid #00e5ff;
      border-radius: 8px;
      padding: 10px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    .mapboxgl-popup-tip {
      border-top-color: rgba(15, 23, 42, 0.95) !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = '${MAPBOX_ACCESS_TOKEN}';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [${sectorView.center[1]}, ${sectorView.center[0]}],
      zoom: 13.5,
      pitch: 60,
      bearing: -15,
      maxBounds: [
        [83.05, 17.55], // Southwest coordinates of Visakhapatnam
        [83.50, 17.95]  // Northeast coordinates of Visakhapatnam
      ],
      minZoom: 11,
      maxZoom: 18,
      antialias: true
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // 3D Terrain DEM
      try {
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      } catch(e) { console.error('Terrain error:', e); }

      // 3D Buildings Layer
      try {
        const layers = map.getStyle().layers;
        const labelLayerId = layers.find(layer => layer.type === 'symbol' && layer.layout['text-field'])?.id;
        map.addLayer({
          'id': 'add-3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 13,
          'paint': {
            'fill-extrusion-color': '#0f172a',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.85
          }
        }, labelLayerId);
      } catch(e) { console.error('Buildings error:', e); }

      // Add Water Supply Pipes
      const pipesData = ${JSON.stringify({
        type: 'FeatureCollection',
        features: MAP_PIPES.map((pipe, idx) => ({
          type: 'Feature',
          properties: { id: `pipe_${idx}` },
          geometry: {
            type: 'LineString',
            coordinates: [
              [pipe.from[1], pipe.from[0]],
              [pipe.to[1], pipe.to[0]]
            ]
          }
        }))
      })};

      map.addSource('pipes', { type: 'geojson', data: pipesData });
      map.addLayer({
        'id': 'pipes-glow',
        'type': 'line',
        'source': 'pipes',
        'layout': { 'line-join': 'round', 'line-cap': 'round' },
        'paint': {
          'line-color': '#00e5ff',
          'line-width': 8,
          'line-opacity': 0.35,
          'line-blur': 4
        }
      });
      map.addLayer({
        'id': 'pipes-line',
        'type': 'line',
        'source': 'pipes',
        'layout': { 'line-join': 'round', 'line-cap': 'round' },
        'paint': {
          'line-color': '#00e5ff',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      });

      // Add Glowing 3D Node Markers
      const nodes = ${JSON.stringify(filteredNodes)};
      nodes.forEach(node => {
        const el = document.createElement('div');
        el.className = 'custom-marker' + (node.isAlert ? ' alert' : '');
        el.innerHTML = node.type === 'reservoir' ? '💧' : node.type === 'pump' ? '⚡' : '⚙️';
        
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<div style="font-family: sans-serif;">' +
          '<strong style="color: #00e5ff; font-size: 14px;">' + node.name + '</strong><br/>' +
          '<div style="margin-top: 4px; font-size: 12px; color: #94a3b8;">' +
          'Flow: <span style="color: #fff;">' + node.flow + '</span> · SLA: <span style="color: #fff;">' + node.eff + '</span>' +
          '</div>' +
          '</div>'
        );

        new mapboxgl.Marker(el)
          .setLngLat([node.lon, node.lat])
          .setPopup(popup)
          .addTo(map);
      });
    });
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#070d19',
  },
  webview: {
    flex: 1,
    backgroundColor: '#070d19',
  },
});
