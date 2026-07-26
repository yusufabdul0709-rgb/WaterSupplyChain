/**
 * API Configuration — Backend endpoints and base URLs
 */

// For Android Emulator use 10.0.2.2, for iOS Simulator use localhost
// For physical device, use your machine's LAN IP
export const API_BASE_URL = 'http://10.0.2.2:8000';

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
