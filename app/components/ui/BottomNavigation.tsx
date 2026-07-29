import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Map, ClipboardList, Bot, User } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, BlurIntensity, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface TabItem {
  name: string;
  route: string;
  icon: any;
}

const TABS: TabItem[] = [
  { name: 'home', route: '/(tabs)/home', icon: Home },
  { name: 'map', route: '/(tabs)/map', icon: Map },
  { name: 'complaints', route: '/(tabs)/complaints', icon: ClipboardList },
  { name: 'ai', route: '/(tabs)/ai', icon: Bot },
  { name: 'profile', route: '/(tabs)/profile', icon: User },
];

export function BottomNavigation() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(route as any);
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.floatingContainer}>
        <BlurView intensity={BlurIntensity.heavy} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.includes(tab.name) || (pathname === '/' && tab.name === 'home');

            return (
              <TouchableOpacity
                key={tab.name}
                activeOpacity={0.75}
                onPress={() => handleTabPress(tab.route)}
                style={styles.tabButton}
              >
                <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                  <Icon
                    size={22}
                    color={isActive ? Colors.primary : Colors.textTertiary}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {isActive && <View style={styles.activeDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  floatingContainer: {
    width: width - 40,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: '#E7EDF5',
    ...Shadows.lg,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    paddingHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
