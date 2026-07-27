import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Map, ClipboardList, Bot, User } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BlurIntensity, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface TabItem {
  name: string;
  route: string;
  icon: any;
  label: string;
}

const TABS: TabItem[] = [
  { name: 'home', route: '/(tabs)/home', icon: Home, label: 'Home' },
  { name: 'map', route: '/(tabs)/map', icon: Map, label: 'Map' },
  { name: 'complaints', route: '/(tabs)/complaints', icon: ClipboardList, label: 'Complaints' },
  { name: 'ai', route: '/(tabs)/ai', icon: Bot, label: 'AI Assistant' },
  { name: 'profile', route: '/(tabs)/profile', icon: User, label: 'Profile' },
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
                activeOpacity={0.7}
                onPress={() => handleTabPress(tab.route)}
                style={styles.tabButton}
              >
                <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                  <Icon
                    size={22}
                    color={isActive ? Colors.primary : Colors.textTertiary}
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                </View>

                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? Colors.primary : Colors.textTertiary },
                    isActive && styles.activeTabLabel,
                  ]}
                >
                  {tab.label}
                </Text>
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
    width: width - 32,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...Shadows.lg,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    width: 38,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
  },
  tabLabel: {
    ...Typography.caption2,
    marginTop: 2,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
