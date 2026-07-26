import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Bell, Moon, Shield, Info, Check } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [language, setLanguage] = useState<'EN' | 'TE' | 'HI'>('EN');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [supplyAlerts, setSupplyAlerts] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Language Selection */}
        <GlassCard style={styles.card} intensity={45}>
          <View style={styles.sectionHeader}>
            <Globe size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>App Language / భాష / भाषा</Text>
          </View>

          <View style={styles.langList}>
            {[
              { code: 'EN', label: 'English (Official)' },
              { code: 'TE', label: 'తెలుగు (Telugu)' },
              { code: 'HI', label: 'हिंदी (Hindi)' },
            ].map((item) => {
              const isSelected = language === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  onPress={() => setLanguage(item.code as any)}
                  style={[styles.langItem, isSelected && styles.langItemSelected]}
                >
                  <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                    {item.label}
                  </Text>
                  {isSelected && <Check size={18} color={Colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* Push Notification Preferences */}
        <GlassCard style={styles.card} intensity={45}>
          <View style={styles.sectionHeader}>
            <Bell size={18} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Push Notifications</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Water Supply Alerts</Text>
              <Text style={styles.switchDesc}>Notifications when water supply starts or ends in your ward.</Text>
            </View>
            <Switch
              value={supplyAlerts}
              onValueChange={setSupplyAlerts}
              trackColor={{ false: Colors.divider, true: Colors.primary }}
            />
          </View>

          <View style={[styles.switchRow, { marginTop: 12 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Maintenance & Shut-off Notices</Text>
              <Text style={styles.switchDesc}>Advance alerts for pipeline maintenance in your sector.</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.divider, true: Colors.primary }}
            />
          </View>
        </GlassCard>

        {/* Security & Biometrics */}
        <GlassCard style={styles.card} intensity={45}>
          <View style={styles.sectionHeader}>
            <Shield size={18} color={Colors.success} />
            <Text style={styles.sectionTitle}>Security & Privacy</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Face ID / Biometric Lock</Text>
              <Text style={styles.switchDesc}>Require biometric verification on app launch.</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: Colors.divider, true: Colors.success }}
            />
          </View>
        </GlassCard>

        {/* About App */}
        <GlassCard style={styles.card} intensity={45}>
          <View style={styles.sectionHeader}>
            <Info size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>About Platform</Text>
          </View>

          <Text style={styles.aboutText}>
            GVMC Smart Water Management Platform is a Digital Public Good developed under AMRUT 2.0 and the Visakhapatnam Smart City Mission.
          </Text>

          <Text style={styles.versionText}>App Version: 1.0.0 (Build 2026.07)</Text>
        </GlassCard>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.title3,
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    ...Typography.title3,
    color: Colors.text,
    marginLeft: 8,
    fontSize: 16,
  },
  langList: {},
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  langItemSelected: {
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  langText: {
    ...Typography.subheadMedium,
    color: Colors.text,
  },
  langTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  switchDesc: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
    paddingRight: 10,
  },
  aboutText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  versionText: {
    ...Typography.caption1,
    color: Colors.textTertiary,
    marginTop: 10,
    fontWeight: '600',
  },
});
