import * as Location from 'expo-location';
import { SECTORS, Sector, findNearestSector } from '../constants/sectors';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
}

export async function getCurrentLocation(): Promise<{ location: UserLocation; sector: Sector } | null> {
  try {
    const granted = await requestLocationPermission();
    if (!granted) {
      // Default to MVP Colony Sector center if permission denied
      const defaultSector = SECTORS[1];
      return {
        location: { latitude: defaultSector.centerLat, longitude: defaultSector.centerLon },
        sector: defaultSector,
      };
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const userLoc: UserLocation = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy,
    };

    const nearestSector = findNearestSector(userLoc.latitude, userLoc.longitude);

    return {
      location: userLoc,
      sector: nearestSector,
    };
  } catch (error) {
    console.error('Error fetching current location:', error);
    const defaultSector = SECTORS[1];
    return {
      location: { latitude: defaultSector.centerLat, longitude: defaultSector.centerLon },
      sector: defaultSector,
    };
  }
}
