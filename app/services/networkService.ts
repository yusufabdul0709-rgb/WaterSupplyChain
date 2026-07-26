import { apiFetch } from './api';
import { Endpoints } from '../constants/api';

export interface NetworkNode {
  node_id: string;
  lat: number;
  lon: number;
  type: 'RESERVOIR' | 'JUNCTION' | 'PUMP' | 'TANK';
  current: {
    pressure_bar: number;
    flow_lps: number;
    ph: number;
    status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
    anomaly_score: number;
  };
}

export const networkService = {
  async getNodes() {
    return await apiFetch<NetworkNode[]>(Endpoints.NETWORK_NODES);
  },

  async getPipes() {
    return await apiFetch<any>(Endpoints.NETWORK_PIPES);
  },

  async getAlerts() {
    return await apiFetch<any[]>(Endpoints.ALERTS);
  },
};
