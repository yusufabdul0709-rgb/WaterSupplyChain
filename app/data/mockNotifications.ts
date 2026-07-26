export interface NotificationItem {
  id: string;
  type: 'SUPPLY_START' | 'SUPPLY_END' | 'MAINTENANCE' | 'EMERGENCY' | 'COMPLAINT_UPDATE' | 'QUALITY_ALERT' | 'WEATHER_ALERT';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  sectorId?: string;
  complaintId?: string;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'SUPPLY_START',
    title: 'Morning Water Supply Started',
    description: 'Water supply is live in MVP Colony Sector (Ward 42). Expected pressure: 3.4 bar.',
    timestamp: '10 mins ago',
    isRead: false,
    sectorId: 'SEC_MVP',
  },
  {
    id: 'notif_2',
    type: 'COMPLAINT_UPDATE',
    title: 'Complaint Status Updated',
    description: 'Your complaint #CMP-9A4F21 (Low Pressure) has been assigned to Er. S. Naidu.',
    timestamp: '45 mins ago',
    isRead: false,
    complaintId: 'CMP-9A4F21',
  },
  {
    id: 'notif_3',
    type: 'QUALITY_ALERT',
    title: 'Water Quality Inspection Clear',
    description: 'pH 7.3 & Chlorine 0.8 ppm verified at Simhachalam Reservoir distribution point.',
    timestamp: '2 hours ago',
    isRead: true,
    sectorId: 'SEC_MVP',
  },
  {
    id: 'notif_4',
    type: 'MAINTENANCE',
    title: 'Scheduled Maintenance Notice',
    description: 'Pipeline flushing in Seethammadhara Sector tomorrow between 02:00 PM - 04:00 PM.',
    timestamp: 'Yesterday',
    isRead: true,
    sectorId: 'SEC_SEETHAM',
  },
  {
    id: 'notif_5',
    type: 'WEATHER_ALERT',
    title: 'Heavy Rainfall Warning',
    description: 'GVMC Alert: IMD predicts heavy rain in coastal wards. Stormwater drains active.',
    timestamp: '2 days ago',
    isRead: true,
  },
];
