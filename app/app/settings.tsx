import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Bell, Moon, Shield, Info, Check, Lock } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
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
          <ArrowLeft size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Settings & Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Language Selection */}
        <GlassCard style={styles.card} intensity={40}>
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
                  {isSelected && <Check size={16} color={Colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* Notifications & Push Alerts */}
        <GlassCard style={styles.card} intensity={40}>
          <View style={styles.sectionHeader}>
            <Bell size={18} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>Notifications & Telemetry Alerts</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextGroup}>
              <Text style={styles.switchLabel}>Push Notifications</Text>
              <Text style={styles.switchDesc}>Receive live alerts for water supply slots and pipeline maintenance.</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E2E8F0', true: Colors.primaryLight }}
              thumbColor={notificationsEnabled ? Colors.primary : '#FFF'}
            />
          </View>

          <View style={[styles.switchRow, { marginTop: 12 }]}>
            <View style={styles.switchTextGroup}>
              <Text style={styles.switchLabel}>High Pressure Supply Alerts</Text>
              <Text style={styles.switchDesc}>SMS notification 15 mins before scheduled supply start.</Text>
            </View>
            <Switch
              value={supplyAlerts}
              onValueChange={setSupplyAlerts}
              trackColor={{ false: '#E2E8F0', true: Colors.primaryLight }}
              thumbColor={supplyAlerts ? Colors.primary : '#FFF'}
            />
          </View>
        </GlassCard>

        {/* Security & Biometrics */}
        <GlassCard style={styles.card} intensity={40}>
          <View style={styles.sectionHeader}>
            <Lock size={18} color={Colors.success} />
            <Text style={styles.sectionTitle}>Security & Biometrics</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextGroup}>
              <Text style={styles.switchLabel}>Biometric Face ID / Fingerprint</Text>
              <Text style={styles.switchDesc}>Require biometric verification on app launch.</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E2E8F0', true: Colors.primaryLight }}
              thumbColor={biometricEnabled ? Colors.primary : '#FFF'}
            />
          </View>
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
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.cardTitle,
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    marginBottom: 16,
    borderRadius: BorderRadius.card, // 24px
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    ...Typography.label,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginLeft: 8,
  },
  langList: {},
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(245, 247, 250, 0.8)',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langItemSelected: {
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    borderColor: Colors.primary,
  },
  langText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    fontSize: 14,
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
  switchTextGroup: {
    flex: 1,
    paddingRight: 12,
  },
  switchLabel: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  switchDesc: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
