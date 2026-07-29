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
  Bell,
  CreditCard,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
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
    Alert.alert('Logout Citizen Session', 'Are you sure you want to log out of GVMC Water Portal?', [
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

  const citizenUser = {
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
        <Text style={styles.govtTitle}>CITIZEN PROFILE PORTAL</Text>
        <Text style={styles.title}>Account & Preferences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Citizen Identity Card */}
        <ProfileCard user={citizenUser} />

        {/* Section 2: Municipal Information */}
        <GlassCard style={styles.card} intensity={40}>
          <Text style={styles.cardSectionTitle}>MUNICIPAL INFORMATION</Text>

          <InfoRow
            icon={<MapPin size={18} color={Colors.primary} />}
            label="Registered Address"
            value={citizenUser.address}
          />
          <InfoRow
            icon={<Building size={18} color={Colors.secondary} />}
            label="Municipal Ward & Zone"
            value={`${citizenUser.wardNumber} · ${citizenUser.zone}`}
          />
          <InfoRow
            icon={<Building size={18} color={Colors.primary} />}
            label="Sector"
            value={citizenUser.sectorName}
          />
          <InfoRow
            icon={<Phone size={18} color={Colors.success} />}
            label="Control Room Contact"
            value="+91 891 250002"
            isLast
          />
        </GlassCard>

        {/* Section 3: Statistics */}
        <GlassCard style={styles.card} intensity={40}>
          <Text style={styles.cardSectionTitle}>ACTIVITY STATISTICS</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <ClipboardList size={18} color={Colors.primary} />
              <Text style={styles.statVal}>4</Text>
              <Text style={styles.statLbl}>Complaints</Text>
            </View>

            <View style={styles.statBox}>
              <CheckCircle2 size={18} color={Colors.success} />
              <Text style={[styles.statVal, { color: Colors.success }]}>3</Text>
              <Text style={styles.statLbl}>Resolved</Text>
            </View>

            <View style={styles.statBox}>
              <CreditCard size={18} color={Colors.secondary} />
              <Text style={[styles.statVal, { color: Colors.secondary }]}>12</Text>
              <Text style={styles.statLbl}>Bills Paid</Text>
            </View>

            <View style={styles.statBox}>
              <FileText size={18} color={Colors.info} />
              <Text style={[styles.statVal, { color: Colors.info }]}>2</Text>
              <Text style={styles.statLbl}>Reports</Text>
            </View>
          </View>
        </GlassCard>

        {/* Section 4: Preferences */}
        <GlassCard style={styles.card} intensity={40}>
          <Text style={styles.cardSectionTitle}>PREFERENCES & SECURITY</Text>

          <TouchableOpacity onPress={() => router.push('/settings')}>
            <InfoRow
              icon={<Globe size={18} color={Colors.primary} />}
              label="Language"
              value="English / తెలుగు / हिंदी"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/settings')}>
            <InfoRow
              icon={<Bell size={18} color={Colors.secondary} />}
              label="Push Notifications"
              value="Water Supply & Alerts Enabled"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/settings')}>
            <InfoRow
              icon={<Moon size={18} color={Colors.primary} />}
              label="Theme Mode"
              value="System / Apple Glass"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/settings')}>
            <InfoRow
              icon={<Lock size={18} color={Colors.success} />}
              label="Biometric Face ID"
              value="Enabled"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/settings')}>
            <InfoRow
              icon={<ShieldCheck size={18} color={Colors.info} />}
              label="Privacy & Data Sharing"
              value="AMRUT 2.0 Encrypted"
              isLast
            />
          </TouchableOpacity>
        </GlassCard>

        {/* Section 5: Support & Helplines */}
        <GlassCard style={styles.card} intensity={40}>
          <Text style={styles.cardSectionTitle}>EMERGENCY SUPPORT & HELPLINE</Text>

          <InfoRow
            icon={<Phone size={18} color={Colors.error} />}
            label="GVMC Water Toll-Free"
            value="1800-425-0001 (24x7)"
          />
          <InfoRow
            icon={<HelpCircle size={18} color={Colors.primary} />}
            label="Smart City Support Email"
            value="support@gvmc.gov.in"
            isLast
          />
        </GlassCard>

        {/* Section 6: Logout */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Logout Citizen Session</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>
          Greater Visakhapatnam Municipal Corporation · AMRUT 2.0 Digital Public Goods v1.0.0
        </Text>
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
    ...Typography.label,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...Typography.pageTitle,
    color: Colors.text,
    fontSize: 26,
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 120,
  },
  card: {
    padding: 18,
    marginBottom: 16,
    borderRadius: BorderRadius.card, // 24px
  },
  cardSectionTitle: {
    ...Typography.label,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(245, 247, 250, 0.8)',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statVal: {
    ...Typography.sectionTitle,
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 18,
    marginTop: 4,
  },
  statLbl: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dangerLight,
    paddingVertical: 14,
    borderRadius: BorderRadius.button, // 18px
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginTop: 8,
    marginBottom: 16,
  },
  logoutText: {
    ...Typography.bodyMedium,
    color: Colors.error,
    fontWeight: '700',
    marginLeft: 8,
  },
  appVersion: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 11,
  },
});
