import { create } from 'zustand';
import { Sector, SECTORS } from '../constants/sectors';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  sector: Sector;
  isPermissionGranted: boolean;
  isLoading: boolean;
  setLocation: (lat: number, lon: number, sector: Sector) => void;
  setPermission: (granted: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: 17.7350,
  longitude: 83.3300,
  sector: SECTORS[1], // Default MVP Colony
  isPermissionGranted: true,
  isLoading: false,

  setLocation: (latitude, longitude, sector) => set({ latitude, longitude, sector }),
  setPermission: (isPermissionGranted) => set({ isPermissionGranted }),
  setLoading: (isLoading) => set({ isLoading }),
}));
