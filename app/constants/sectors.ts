/**
 * GVMC Visakhapatnam Sector Data
 * Matches backend database seed data from services/database.py
 */

export interface Sector {
  id: string;
  name: string;
  zone: string;
  adminEmail: string;
  centerLat: number;
  centerLon: number;
  contactPhone: string;
  wards: string[];
  localities: string[];
}

export const SECTORS: Sector[] = [
  {
    id: 'SEC_GAJUWAKA',
    name: 'Gajuwaka Sector',
    zone: 'Zone 1',
    adminEmail: 'gajuwaka@gvmc.gov.in',
    centerLat: 17.6850,
    centerLon: 83.2150,
    contactPhone: '+91 891 250001',
    wards: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    localities: ['Gajuwaka', 'Steel Plant', 'Gangavaram', 'Ukkunagaram', 'Pedagantyada'],
  },
  {
    id: 'SEC_MVP',
    name: 'MVP Colony Sector',
    zone: 'Zone 2',
    adminEmail: 'mvpcolony@gvmc.gov.in',
    centerLat: 17.7350,
    centerLon: 83.3300,
    contactPhone: '+91 891 250002',
    wards: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
    localities: ['MVP Colony', 'Siripuram', 'Dwaraka Nagar', 'Rama Talkies', 'KGH Down'],
  },
  {
    id: 'SEC_SEETHAM',
    name: 'Seethammadhara Sector',
    zone: 'Zone 3',
    adminEmail: 'seethammadhara@gvmc.gov.in',
    centerLat: 17.7400,
    centerLon: 83.3050,
    contactPhone: '+91 891 250003',
    wards: ['45', '46', '47', '48', '49', '50', '51', '52'],
    localities: ['Seethammadhara', 'CBM Compound', 'HB Colony', 'Waltair Uplands', 'Lawsons Bay'],
  },
  {
    id: 'SEC_MADHURA',
    name: 'Madhurawada Sector',
    zone: 'Zone 4',
    adminEmail: 'madhurawada@gvmc.gov.in',
    centerLat: 17.8100,
    centerLon: 83.3500,
    contactPhone: '+91 891 250004',
    wards: ['55', '56', '57', '58', '59', '60', '61', '62'],
    localities: ['Madhurawada', 'Rushikonda', 'Yendada', 'PM Palem', 'Kommadi'],
  },
  {
    id: 'SEC_ANAKAPALLE',
    name: 'Anakapalle Sector',
    zone: 'Zone 5',
    adminEmail: 'anakapalle@gvmc.gov.in',
    centerLat: 17.6900,
    centerLon: 83.0000,
    contactPhone: '+91 891 250005',
    wards: ['65', '66', '67', '68', '69', '70', '71', '72'],
    localities: ['Anakapalle', 'Kasimkota', 'Chodavaram', 'Yelamanchili', 'Sabbavaram'],
  },
];

/**
 * Map visualization nodes — matches frontend MapView.jsx sector nodes
 * These are used for the citizen Digital Twin view
 */
export const MAP_NODES = [
  { id: 'N1', name: 'Old Gajuwaka Main', lat: 17.685, lon: 83.215, type: 'reservoir' as const, sector: 'SEC_GAJUWAKA', flow: '4,500 L/s', eff: '98%' },
  { id: 'N2', name: 'Simhachalam Hill Tank', lat: 17.755, lon: 83.250, type: 'tank' as const, sector: 'SEC_SEETHAM', flow: '3,100 L/s', eff: '94%' },
  { id: 'N3', name: 'Gopalapatnam Command Hub', lat: 17.730, lon: 83.280, type: 'pump' as const, sector: 'SEC_SEETHAM', flow: '1,850 L/s', eff: '82%' },
  { id: 'N4', name: 'Siripuram Junction Node', lat: 17.720, lon: 83.315, type: 'junction' as const, sector: 'SEC_MVP', flow: '3,312 L/s', eff: '89%' },
  { id: 'N5', name: 'MVP Colony Grid Hub', lat: 17.738, lon: 83.332, type: 'reservoir' as const, sector: 'SEC_MVP', flow: '5,200 L/s', eff: '95%' },
  { id: 'N6', name: 'Rushikonda Coastal Station', lat: 17.765, lon: 83.355, type: 'tank' as const, sector: 'SEC_MADHURA', flow: '2,400 L/s', eff: '91%' },
  { id: 'N7', name: 'Madhurawada North Reservoir', lat: 17.815, lon: 83.365, type: 'tank' as const, sector: 'SEC_MADHURA', flow: '4,100 L/s', eff: '93%' },
];

/** Pipeline connections for map visualization */
export const MAP_PIPES = [
  { from: [17.685, 83.215], to: [17.730, 83.280] },
  { from: [17.755, 83.250], to: [17.730, 83.280] },
  { from: [17.755, 83.250], to: [17.720, 83.315] },
  { from: [17.730, 83.280], to: [17.720, 83.315] },
  { from: [17.720, 83.315], to: [17.738, 83.332] },
  { from: [17.738, 83.332], to: [17.765, 83.355] },
  { from: [17.765, 83.355], to: [17.815, 83.365] },
];

/** Sector center coordinates for map camera */
export const SECTOR_MAP_VIEWS: Record<string, { center: [number, number]; zoom: number }> = {
  ALL: { center: [17.740, 83.290], zoom: 12 },
  SEC_GAJUWAKA: { center: [17.6850, 83.2150], zoom: 14 },
  SEC_MVP: { center: [17.7380, 83.3320], zoom: 14 },
  SEC_SEETHAM: { center: [17.7400, 83.3050], zoom: 14 },
  SEC_MADHURA: { center: [17.8150, 83.3650], zoom: 14 },
  SEC_ANAKAPALLE: { center: [17.6900, 83.0000], zoom: 13 },
};

/** Find nearest sector from GPS coordinates */
export function findNearestSector(lat: number, lon: number): Sector {
  let minDist = Infinity;
  let closest = SECTORS[0];

  for (const sector of SECTORS) {
    const d = haversineDistance(lat, lon, sector.centerLat, sector.centerLon);
    if (d < minDist) {
      minDist = d;
      closest = sector;
    }
  }
  return closest;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
  return 12742 * Math.asin(Math.sqrt(a));
}
