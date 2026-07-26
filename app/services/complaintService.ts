import { apiFetch } from './api';
import { Endpoints } from '../constants/api';

export interface ComplaintData {
  id: string;
  title?: string;
  description: string;
  lat: number;
  lng?: number;
  lon?: number;
  sector_id: string;
  sector_name?: string;
  citizen_name?: string;
  phone?: string;
  issue_type?: string;
  status?: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  created_at?: string;
  assigned_engineer?: string;
  rating?: number;
}

export const complaintService = {
  async listComplaints(sectorId?: string) {
    const query = sectorId && sectorId !== 'ALL' ? `?sector_id=${sectorId}` : '';
    const res = await apiFetch<ComplaintData[]>(`${Endpoints.COMPLAINTS}${query}`);
    return res;
  },

  async createComplaint(data: {
    title: string;
    description: string;
    lat: number;
    lng: number;
    sector_id: string;
    citizen_name?: string;
    phone?: string;
  }) {
    const res = await apiFetch<{ message: string; id: string }>(Endpoints.COMPLAINTS, {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        lat: data.lat,
        lng: data.lng,
        lon: data.lng,
        sector_id: data.sector_id,
        citizen_name: data.citizen_name || 'Ramesh Kumar',
        phone: data.phone || '+91 98480 12345',
      }),
    });
    return res;
  },
};
