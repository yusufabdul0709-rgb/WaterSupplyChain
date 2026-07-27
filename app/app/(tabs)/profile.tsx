import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Building,
  Phone,
  ShieldCheck,
  Globe,
  Moon,
  Lock,
  LogOut,
  HelpCircle,
  FileText,
} from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { ProfileCard } from '../../components/profile/ProfileCard';
import { InfoRow } from '../../components/profile/InfoRow';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of GVMC Water Portal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const dummyUser = {
    name: user?.name || 'Ramesh Kumar',
    phone: user?.phone || '+91 98480 12345',
    email: user?.email || 'ramesh.kumar@gvmc.citizen.in',
    address: user?.address || 'Flat 402, Sri Sai Residency, Sector 6',
    wardNumber: user?.wardNumber || 'Ward 42',
    sectorId: user?.sectorId || 'SEC_MVP',
    sectorName: user?.sectorName || 'MVP Colony Sector',
    zone: user?.zone || 'Zone 2',
    pincode: user?.pincode || '530017',
    consumerId: user?.consumerId || 'GVMC-W42-892104',
    connectionId: user?.connectionId || 'WTR-MVP-42-8921',
    verificationStatus: 'VERIFIED' as const,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.govtTitle}>CITIZEN PROFILE</Text>
        <Text style={styles.title}>Account & Preferences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Glass Profile Card */}
        <ProfileCard user={dummyUser} />

        {/* Location & Connection Details */}
        <GlassCard style={styles.card} intensity={40}>
          <Text style={styles.cardSectionTitle}>MUNICIPAL LOCATION & CONNECTION</Text>

          <InfoRow
            icon={<MapPin size={18} color={Colors.primary} />}
            label="Registered Address"
            value={dummyUser.address}
          />
          <InfoRow
            icon={<Building size={18} color={Colors.secondary} />}
            label="Municipal Ward"
            value={dummyUser.wardNumber}
          />
          <InfoRow
            icon={<Building size={18} color={Colors.primary} />}
            label="Sector & Zone"
            value={`${dummyUser.sectorName} (${dummyUser.zone})`}
          />
          <InfoRow
            icon={<Phone size={18} color={Colors.success} />}
            label="Control Room Contact"
            value="+91 891 250002"
            isLast
          />
        </GlassCard>

        {/* Settings & Preferences */}
        <GlassCard style={styles.card} intensity={40}>
          <Text style={styles.cardSectionTitle}>APP PREFERENCES</Text>

          <TouchableOpacity onPress={() => router.push('/settings')}>
            <InfoRow
              icon={<Globe size={18} color={Colors.primary} />}
              label="Language"
              value="English / తెలుగు / हिंदी"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/settings')}>
            <InfoRow
              icon={<Moon size={18} color={Colors.secondary} />}
              label="Theme Mode"
              value="System / Light Glass"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/settings')}>
            <InfoRow
              icon={<Lock size={18} color={Colors.primary} />}
              label="Biometric Face ID"
              value="Enabled"
              isLast
            />
          </TouchableOpacity>
        </GlassCard>

        {/* Emergency Contacts */}
        <GlassCard style={styles.card} intensity={40}>
          <Text style={styles.cardSectionTitle}>EMERGENCY HELPLINE</Text>

          <InfoRow
            icon={<Phone size={18} color={Colors.danger} />}
            label="GVMC Water Helpline"
            value="1800-425-0001 (Toll Free)"
          />
          <InfoRow
            icon={<HelpCircle size={18} color={Colors.primary} />}
            label="Smart City Support"
            value="support@gvmc.gov.in"
            isLast
          />
        </GlassCard>

        {/* Logout Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Logout Citizen Session</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>GVMC Smart Water App v1.0.0 · AMRUT 2.0 Digital Public Goods</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.screen,
    marginBottom: 16,
  },
  govtTitle: {
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...Typography.title1,
    color: Colors.text,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 120,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardSectionTitle: {
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dangerLight,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.3)',
    marginTop: 10,
    marginBottom: 16,
  },
  logoutText: {
    ...Typography.subheadMedium,
    color: Colors.danger,
    fontWeight: '700',
    marginLeft: 8,
  },
  appVersion: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 20,
  },
});
