import { useEffect } from 'react';
import { getCurrentLocation } from '../utils/location';
import { useLocationStore } from '../store/locationStore';

export function useLocation() {
  const { latitude, longitude, sector, isPermissionGranted, isLoading, setLocation, setPermission, setLoading } = useLocationStore();

  useEffect(() => {
    async function initLocation() {
      setLoading(true);
      const res = await getCurrentLocation();
      if (res) {
        setLocation(res.location.latitude, res.location.longitude, res.sector);
        setPermission(true);
      } else {
        setPermission(false);
      }
      setLoading(false);
    }

    initLocation();
  }, []);

  return { latitude, longitude, sector, isPermissionGranted, isLoading };
}
