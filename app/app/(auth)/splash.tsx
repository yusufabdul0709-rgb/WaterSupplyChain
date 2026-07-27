import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Colors, Typography } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#003875', '#005BAC', '#00A6D6']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Animated.View entering={ZoomIn.duration(800)} style={styles.logoBadge}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmblem}>💧</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.titleContainer}>
          <Text style={styles.govtText}>GREATER VISAKHAPATNAM MUNICIPAL CORPORATION</Text>
          <Text style={styles.appName}>GVMC WATER</Text>
          <Text style={styles.subtitle}>Smart Citizen Portal · Digital Twin Platform</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(1000).duration(600)} style={styles.footer}>
        <View style={styles.badgeRow}>
          <Text style={styles.footerTag}>AMRUT 2.0</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.footerTag}>VIZAG SMART CITY</Text>
        </View>
        <Text style={styles.copyright}>Government of Andhra Pradesh</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmblem: {
    fontSize: 48,
  },
  titleContainer: {
    alignItems: 'center',
  },
  govtText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  appName: {
    ...Typography.largeTitle,
    fontSize: 38,
    color: Colors.textInverse,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    ...Typography.callout,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 6,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  footerTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
  },
  dot: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 8,
  },
  copyright: {
    ...Typography.caption1,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
