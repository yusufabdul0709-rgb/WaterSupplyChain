import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Droplet, ShieldCheck, Cpu } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: Droplet,
    title: 'Monitor Water Supply Live',
    subtitle: 'Real-time telemetry and supply schedules for your ward and municipal sector.',
  },
  {
    id: '2',
    icon: Cpu,
    title: 'Localized Digital Twin',
    subtitle: 'Interactive 3D map zoomed to your locality showing reservoirs, pipelines, and flow.',
  },
  {
    id: '3',
    icon: ShieldCheck,
    title: 'Instant Grievance Redressal',
    subtitle: 'Report leaks, low pressure, or dirty water with GPS auto-routing to sector engineers.',
  },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.govtHeader}>GREATER VISAKHAPATNAM MUNICIPAL CORPORATION</Text>
        <Text style={styles.appTitle}>GVMC Citizen Portal</Text>
      </View>

      <FlatList
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View style={styles.slide}>
              <GlassCard style={styles.card} intensity={40}>
                <View style={styles.iconContainer}>
                  <Icon size={48} color={Colors.primary} />
                </View>
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
              </GlassCard>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.indicatorContainer}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.indicator, activeIndex === i ? styles.activeIndicator : null]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <GlassButton
          title="Get Started with Phone Number"
          onPress={() => router.push('/(auth)/login')}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    marginTop: 10,
  },
  govtHeader: {
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  appTitle: {
    ...Typography.title1,
    color: Colors.primary,
    fontWeight: '800',
    marginTop: 4,
  },
  slide: {
    width: width,
    paddingHorizontal: Spacing.screen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 30,
    alignItems: 'center',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  slideTitle: {
    ...Typography.title2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  slideSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textTertiary,
    marginHorizontal: 4,
    opacity: 0.4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: Colors.primary,
    opacity: 1,
  },
  footer: {
    paddingHorizontal: Spacing.screen,
  },
  button: {
    width: '100%',
  },
});
