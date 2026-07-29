import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, MapPin, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, BlurIntensity, BorderRadius } from '../../constants/theme';
import { getTimeBasedGreeting } from '../../utils/time';

interface AnimatedHeaderProps {
  userName?: string;
  sectorName?: string;
  wardNumber?: string;
  zone?: string;
  unreadNotifications?: boolean;
}

export function AnimatedHeader({
  userName = 'Ramesh Kumar',
  sectorName = 'MVP Colony Sector',
  wardNumber = 'Ward 42',
  zone = 'Zone 2',
  unreadNotifications = true,
}: AnimatedHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { greeting, emoji } = getTimeBasedGreeting();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 6 }]}>
      <BlurView intensity={BlurIntensity.medium} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <View style={styles.left}>
          {/* Avatar with exact 26px radius (52x52 container) */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
            <View style={styles.verifiedDot}>
              <ShieldCheck size={10} color="#FFF" />
            </View>
          </View>

          <View style={styles.textGroup}>
            <Text style={styles.greeting}>
              {greeting} {emoji}
            </Text>
            <Text style={styles.name}>{userName}</Text>
            <View style={styles.locationBadge}>
              <MapPin size={12} color={Colors.secondary} />
              <Text style={styles.locationText}>
                {wardNumber} · {zone} · {sectorName}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/notifications')}
          style={styles.notificationButton}
        >
          <Bell size={20} color={Colors.text} />
          {unreadNotifications && <View style={styles.unreadBadge} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(245, 247, 250, 0.88)',
    borderBottomWidth: 1,
    borderColor: Colors.border,
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
    flex: 1,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.avatar, // Exact 26px
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: '800',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.success,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  textGroup: {
    justifyContent: 'center',
    flex: 1,
  },
  greeting: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  name: {
    ...Typography.cardTitle,
    color: Colors.text,
    fontSize: 17,
    marginTop: -1,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 11,
    marginLeft: 3,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
});
