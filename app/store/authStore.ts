import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateConsumerId } from '../utils/formatters';

export interface CitizenUser {
  id?: number | string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  wardNumber: string;
  sectorId: string;
  sectorName: string;
  zone: string;
  pincode: string;
  consumerId: string;
  connectionId: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  registeredAt?: string;
}

interface AuthState {
  token: string | null;
  user: CitizenUser | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setAuth: (token: string, user: CitizenUser) => void;
  setUser: (user: CitizenUser) => void;
  setOnboarded: (status: boolean) => void;
  logout: () => void;
  loadSession: () => Promise<void>;
}

const AUTH_STORAGE_KEY = '@gvmc_citizen_auth';

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: {
    name: 'Ramesh Kumar',
    phone: '+91 98480 12345',
    email: 'ramesh.kumar@gvmc.citizen.in',
    address: 'Flat 402, Sri Sai Residency, Sector 6',
    wardNumber: 'Ward 42',
    sectorId: 'SEC_MVP',
    sectorName: 'MVP Colony Sector',
    zone: 'Zone 2',
    pincode: '530017',
    consumerId: generateConsumerId('42'),
    connectionId: 'WTR-MVP-42-8921',
    verificationStatus: 'VERIFIED',
    registeredAt: '2026-01-15',
  },
  isAuthenticated: true, // Default to true for instant preview/demo
  isOnboarded: true,

  setAuth: async (token, user) => {
    set({ token, user, isAuthenticated: true, isOnboarded: true });
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  },

  setUser: (user) => {
    set({ user });
  },

  setOnboarded: (status) => {
    set({ isOnboarded: status });
  },

  logout: async () => {
    set({ token: null, user: null, isAuthenticated: false });
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth state:', e);
    }
  },

  loadSession: async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { token, user } = JSON.parse(stored);
        if (token && user) {
          set({ token, user, isAuthenticated: true, isOnboarded: true });
        }
      }
    } catch (e) {
      console.error('Failed to load auth session:', e);
    }
  },
}));
