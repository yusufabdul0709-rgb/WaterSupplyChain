import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { OTPInput } from '../../components/ui/OTPInput';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { formatPhoneNumber } from '../../utils/formatters';

export default function OTPScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = params.phone || '9848012345';

  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || otpCode;
    if (finalCode.length < 6) {
      Alert.alert('Incomplete OTP', 'Please enter the 6-digit verification code sent to your phone.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyOTP(phone, finalCode);
      setAuth(res.token, res.user);
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
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
        <Text style={styles.govtTitle}>VERIFICATION</Text>
        <Text style={styles.title}>Enter OTP Code</Text>
        <Text style={styles.subtitle}>
          A 6-digit code has been sent to{' '}
          <Text style={styles.phoneHighlight}>{formatPhoneNumber(phone)}</Text>
        </Text>
      </View>

      <GlassCard style={styles.card} intensity={45}>
        <View style={styles.iconCircle}>
          <ShieldCheck size={36} color={Colors.primary} />
        </View>

        <OTPInput
          length={6}
          onCodeFilled={(code) => {
            setOtpCode(code);
            handleVerify(code);
          }}
        />

        <GlassButton
          title="Verify & Access Portal"
          onPress={() => handleVerify()}
          loading={loading}
          variant="primary"
          style={styles.submitButton}
        />

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={() => setTimer(30)}>
              <Text style={styles.resendLink}>Resend OTP Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>
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
  phoneHighlight: {
    color: Colors.primary,
    fontWeight: '700',
  },
  card: {
    padding: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    width: '100%',
    marginTop: 10,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  timerText: {
    ...Typography.footnoteMedium,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
  resendLink: {
    ...Typography.footnoteMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
});
