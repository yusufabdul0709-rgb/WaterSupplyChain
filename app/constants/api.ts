/**
 * API Configuration — Backend endpoints and base URLs
 *
 * Auto-detects the dev machine's IP from Expo's debugger host so the app
 * works on emulators, simulators, and physical devices without hardcoding.
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BACKEND_PORT = 8000;

function getApiBaseUrl(): string {
  // In Expo Go / dev-client, the debugger host contains the dev machine's IP
  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoConfig?.hostUri;

  if (debuggerHost) {
    // debuggerHost is "192.168.x.x:8081" — strip the Expo port and use backend port
    const host = debuggerHost.split(':')[0];
    return `http://${host}:${BACKEND_PORT}`;
  }

  // Fallback for Android emulator / web / production
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${BACKEND_PORT}`; // Android emulator loopback
  }
  return `http://localhost:${BACKEND_PORT}`;
}

export const API_BASE_URL = getApiBaseUrl();

export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';

export const Endpoints = {
  // Auth
  AUTH_REGISTER: '/api/v1/auth/users/register',
  AUTH_LOGIN: '/api/v1/auth/users/login',

  // Network / Digital Twin
  NETWORK_NODES: '/api/v1/network/nodes',
  NETWORK_PIPES: '/api/v1/network/pipes',

  // Complaints
  COMPLAINTS: '/api/v1/complaints',

  // Sectors
  SECTORS: '/api/v1/sectors',

  // Alerts
  ALERTS: '/api/v1/alerts',

  // Sensors
  SENSOR_HISTORY: '/api/v1/sensors', // /{node_id}/history?minutes=30

  // Simulation
  SIMULATION_LATEST: '/api/v1/simulation/latest',

  // Health
  HEALTH: '/api/v1/health',

  // WebSocket
  WS_LIVE: '/ws/live',
} as const;

export const WS_URL = API_BASE_URL.replace('http', 'ws');
