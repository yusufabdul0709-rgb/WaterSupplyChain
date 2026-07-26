import { apiFetch } from './api';
import { Endpoints } from '../constants/api';
import { CitizenUser } from '../store/authStore';

export const authService = {
  async register(data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }) {
    const res = await apiFetch<{ message: string; id: number }>(Endpoints.AUTH_REGISTER, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email || `${data.phone}@citizen.gvmc.gov.in`,
        phone: data.phone,
        password: data.password || 'citizen123',
      }),
    });
    return res;
  },

  async login(phone: string) {
    // Front-end simulated OTP request
    const email = `${phone}@citizen.gvmc.gov.in`;
    const res = await apiFetch<{ token: string; user: any }>(Endpoints.AUTH_LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        password: 'citizen123',
      }),
    });
    return res;
  },

  async verifyOTP(phone: string, otp: string): Promise<{ token: string; user: CitizenUser }> {
    // Simulated OTP verification for UI prototype
    await new Promise((r) => setTimeout(r, 600));
    return {
      token: `gvmc_token_${phone}_${Date.now()}`,
      user: {
        name: 'Ramesh Kumar',
        phone: phone,
        email: `${phone}@citizen.gvmc.gov.in`,
        address: 'MVP Colony, Sector 6',
        wardNumber: 'Ward 42',
        sectorId: 'SEC_MVP',
        sectorName: 'MVP Colony Sector',
        zone: 'Zone 2',
        pincode: '530017',
        consumerId: `GVMC-W42-${Math.floor(100000 + Math.random() * 900000)}`,
        connectionId: `WTR-MVP-42-${Math.floor(1000 + Math.random() * 9000)}`,
        verificationStatus: 'VERIFIED',
      },
    };
  },
};
