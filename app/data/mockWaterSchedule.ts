export interface WaterSchedule {
  sectorId: string;
  sectorName: string;
  ward: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE' | 'SCHEDULED';
  currentPressureBar: number;
  expectedDurationHours: number;
  morningSlot: { start: string; end: string };
  eveningSlot: { start: string; end: string };
  nextSupplyTime: string; // ISO string
  reservoirSource: string;
  waterQualityIndex: number; // 0-100
  phLevel: number;
  chlorinePpm: number;
  turbidityNtu: number;
}

export const MOCK_WATER_SCHEDULES: Record<string, WaterSchedule> = {
  SEC_MVP: {
    sectorId: 'SEC_MVP',
    sectorName: 'MVP Colony Sector',
    ward: 'Ward 42',
    status: 'AVAILABLE',
    currentPressureBar: 3.4,
    expectedDurationHours: 2.5,
    morningSlot: { start: '06:00 AM', end: '08:30 AM' },
    eveningSlot: { start: '05:30 PM', end: '07:30 PM' },
    nextSupplyTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    reservoirSource: 'Simhachalam Hill Reservoir & Yeleru Pipeline',
    waterQualityIndex: 96,
    phLevel: 7.3,
    chlorinePpm: 0.8,
    turbidityNtu: 0.4,
  },
  SEC_GAJUWAKA: {
    sectorId: 'SEC_GAJUWAKA',
    sectorName: 'Gajuwaka Sector',
    ward: 'Ward 08',
    status: 'AVAILABLE',
    currentPressureBar: 3.1,
    expectedDurationHours: 2.0,
    morningSlot: { start: '05:30 AM', end: '07:30 AM' },
    eveningSlot: { start: '06:00 PM', end: '08:00 PM' },
    nextSupplyTime: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    reservoirSource: 'Thatipudi Reservoir & Steel Plant Main Grid',
    waterQualityIndex: 94,
    phLevel: 7.2,
    chlorinePpm: 0.7,
    turbidityNtu: 0.5,
  },
  SEC_SEETHAM: {
    sectorId: 'SEC_SEETHAM',
    sectorName: 'Seethammadhara Sector',
    ward: 'Ward 48',
    status: 'SCHEDULED',
    currentPressureBar: 1.2,
    expectedDurationHours: 2.5,
    morningSlot: { start: '06:30 AM', end: '09:00 AM' },
    eveningSlot: { start: '06:30 PM', end: '08:30 PM' },
    nextSupplyTime: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    reservoirSource: 'Simhachalam Reservoir Main Line',
    waterQualityIndex: 95,
    phLevel: 7.4,
    chlorinePpm: 0.9,
    turbidityNtu: 0.3,
  },
  SEC_MADHURA: {
    sectorId: 'SEC_MADHURA',
    sectorName: 'Madhurawada Sector',
    ward: 'Ward 58',
    status: 'AVAILABLE',
    currentPressureBar: 3.8,
    expectedDurationHours: 3.0,
    morningSlot: { start: '06:00 AM', end: '09:00 AM' },
    eveningSlot: { start: '05:00 PM', end: '07:30 PM' },
    nextSupplyTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    reservoirSource: 'Gosthani River Pumping Station',
    waterQualityIndex: 98,
    phLevel: 7.5,
    chlorinePpm: 0.8,
    turbidityNtu: 0.2,
  },
  SEC_ANAKAPALLE: {
    sectorId: 'SEC_ANAKAPALLE',
    sectorName: 'Anakapalle Sector',
    ward: 'Ward 68',
    status: 'MAINTENANCE',
    currentPressureBar: 0.5,
    expectedDurationHours: 1.5,
    morningSlot: { start: '07:00 AM', end: '08:30 AM' },
    eveningSlot: { start: '06:00 PM', end: '07:30 PM' },
    nextSupplyTime: new Date(Date.now() + 360 * 60 * 1000).toISOString(),
    reservoirSource: 'Raiwada Canal Feeder',
    waterQualityIndex: 91,
    phLevel: 7.1,
    chlorinePpm: 0.6,
    turbidityNtu: 0.8,
  },
};
