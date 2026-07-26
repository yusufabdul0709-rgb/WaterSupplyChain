import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/theme';

interface MapMarkerProps {
  name: string;
  type: 'reservoir' | 'pump' | 'tank' | 'junction';
  flow?: string;
  isAlert?: boolean;
}

export function MapMarker({ name, type, isAlert }: MapMarkerProps) {
  const getIcon = () => {
    switch (type) {
      case 'reservoir':
        return '💧';
      case 'pump':
        return '⚙️';
      case 'tank':
        return '🛢️';
      case 'junction':
      default:
        return '📍';
    }
  };

  return (
    <View style={[styles.container, isAlert && styles.alertContainer]}>
      <View style={[styles.markerCircle, isAlert && styles.alertCircle]}>
        <Text style={styles.iconText}>{isAlert ? '⚠️' : getIcon()}</Text>
      </View>
      <View style={styles.labelCallout}>
        <Text style={styles.labelText} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  alertContainer: {},
  markerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#070d19',
    borderWidth: 2,
    borderColor: '#00e5ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00e5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  alertCircle: {
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  iconText: {
    fontSize: 16,
  },
  labelCallout: {
    backgroundColor: 'rgba(7, 13, 25, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  labelText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
