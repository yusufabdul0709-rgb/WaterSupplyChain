import { MOCK_WATER_SCHEDULES, WaterSchedule } from '../data/mockWaterSchedule';

export const waterService = {
  getScheduleForSector(sectorId: string): WaterSchedule {
    return MOCK_WATER_SCHEDULES[sectorId] || MOCK_WATER_SCHEDULES['SEC_MVP'];
  },
};
