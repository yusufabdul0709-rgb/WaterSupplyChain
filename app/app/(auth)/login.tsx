import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, Fingerprint, ArrowLeft } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [phone, setPhone] = useState('9848012345');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setLoading(true);
    try {
      await authService.login(phone);
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (e) {
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Biometric Unavailable', 'Biometric authentication is not supported on this device.');
      return;
    }

    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Face ID / Touch ID for GVMC Water',
      fallbackLabel: 'Use OTP',
    });

    if (res.success) {
      router.push('/(auth)/otp?phone=9848012345');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }]}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.govtTitle}>CITIZEN LOGIN</Text>
        <Text style={styles.title}>Welcome to GVMC Water</Text>
        <Text style={styles.subtitle}>Enter your registered 10-digit mobile number to receive a secure OTP.</Text>
      </View>

      <GlassCard style={styles.card} intensity={45}>
        <Input
          label="Mobile Phone Number"
          placeholder="Enter 10-digit phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          leftIcon={<Phone size={20} color={Colors.primary} />}
        />

        <GlassButton
          title="Send OTP Verification Code"
          onPress={handleSendOTP}
          loading={loading}
          variant="primary"
          style={styles.submitButton}
        />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR FAST LOGIN</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={handleBiometricAuth} style={styles.biometricButton}>
          <Fingerprint size={28} color={Colors.primary} />
          <Text style={styles.biometricText}>Face ID / Fingerprint Login Ready</Text>
        </TouchableOpacity>
      </GlassCard>

      <View style={styles.registerLinkContainer}>
        <Text style={styles.registerPrompt}>New Citizen? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerLink}>Register Account & Location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: Spacing.screen,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  govtTitle: {
    ...Typography.caption1,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  title: {
    ...Typography.title1,
    color: Colors.text,
    marginTop: 4,
  },
  subtitle: {
    ...Typography.subhead,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  card: {
    padding: 24,
  },
  submitButton: {
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    marginHorizontal: 12,
    fontWeight: '600',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 91, 172, 0.2)',
  },
  biometricText: {
    ...Typography.subheadMedium,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 10,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerPrompt: {
    ...Typography.subhead,
    color: Colors.textSecondary,
  },
  registerLink: {
    ...Typography.subheadMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
});
