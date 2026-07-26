import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, BlurIntensity } from '../../constants/theme';
import { getTimeBasedGreeting } from '../../utils/time';

interface AnimatedHeaderProps {
  userName?: string;
  sectorName?: string;
  wardNumber?: string;
  unreadNotifications?: boolean;
}

export function AnimatedHeader({
  userName = 'Citizen',
  sectorName = 'MVP Colony',
  wardNumber = 'Ward 42',
  unreadNotifications = true,
}: AnimatedHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { greeting, emoji } = getTimeBasedGreeting();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 8 }]}>
      <BlurView intensity={BlurIntensity.light} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.container}>
        <View style={styles.left}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <View style={styles.textGroup}>
            <Text style={styles.greeting}>
              {greeting} {emoji}
            </Text>
            <Text style={styles.name}>{userName}</Text>
            <View style={styles.locationBadge}>
              <MapPin size={12} color={Colors.primary} />
              <Text style={styles.locationText}>
                {wardNumber} · {sectorName}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/notifications')}
          style={styles.notificationButton}
        >
          <Bell size={22} color={Colors.text} />
          {unreadNotifications && <View style={styles.unreadBadge} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(246, 248, 251, 0.85)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingBottom: 12,
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatarText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '700',
  },
  textGroup: {
    justifyContent: 'center',
  },
  greeting: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  name: {
    ...Typography.title3,
    color: Colors.text,
    marginTop: -2,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    ...Typography.caption1,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
});
