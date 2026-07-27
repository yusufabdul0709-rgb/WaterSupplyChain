import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Phone, MapPin, Building, Hash, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { Input } from '../../components/ui/Input';
import { SECTORS } from '../../constants/sectors';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { generateConsumerId } from '../../utils/formatters';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState('Ramesh Kumar');
  const [phone, setPhone] = useState('9848012345');
  const [address, setAddress] = useState('Flat 402, Sri Sai Residency');
  const [wardNumber, setWardNumber] = useState('42');
  const [selectedSector, setSelectedSector] = useState(SECTORS[1]); // MVP Colony
  const [pincode, setPincode] = useState('530017');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !address || !wardNumber || !pincode) {
      Alert.alert('Missing Fields', 'Please complete all required citizen registration fields.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({ name, phone, email: `${phone}@citizen.gvmc.gov.in` });
      
      const citizenUser = {
        name,
        phone: `+91 ${phone}`,
        email: `${phone}@citizen.gvmc.gov.in`,
        address,
        wardNumber: `Ward ${wardNumber}`,
        sectorId: selectedSector.id,
        sectorName: selectedSector.name,
        zone: selectedSector.zone,
        pincode,
        consumerId: generateConsumerId(wardNumber),
        connectionId: `WTR-${selectedSector.id.replace('SEC_', '')}-${wardNumber}-1082`,
        verificationStatus: 'VERIFIED' as const,
      };

      setAuth(`token_registered_${phone}`, citizenUser);
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Registration Failed', 'Could not complete registration. Please try again.');
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
        <Text style={styles.govtTitle}>NEW CITIZEN PORTAL REGISTRATION</Text>
        <Text style={styles.title}>Citizen Registration</Text>
        <Text style={styles.subtitle}>Enter your details and municipal location to link your household water supply.</Text>
      </View>

      <GlassCard style={styles.card} intensity={45}>
        <Input
          label="Full Name"
          placeholder="Enter full legal name"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={20} color={Colors.primary} />}
        />

        <Input
          label="Mobile Phone Number"
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          leftIcon={<Phone size={20} color={Colors.primary} />}
        />

        <Input
          label="Street Address / House Number"
          placeholder="House/Flat No., Street, Colony"
          value={address}
          onChangeText={setAddress}
          leftIcon={<MapPin size={20} color={Colors.primary} />}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Input
              label="Ward Number"
              placeholder="e.g. 42"
              keyboardType="number-pad"
              value={wardNumber}
              onChangeText={setWardNumber}
              leftIcon={<Hash size={20} color={Colors.primary} />}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Input
              label="Pincode"
              placeholder="530017"
              keyboardType="number-pad"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
              leftIcon={<Building size={20} color={Colors.primary} />}
            />
          </View>
        </View>

        <Text style={styles.sectorLabel}>Municipal Sector & Zone</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectorPicker}>
          {SECTORS.map((sec) => {
            const isSelected = selectedSector.id === sec.id;
            return (
              <TouchableOpacity
                key={sec.id}
                activeOpacity={0.7}
                onPress={() => setSelectedSector(sec)}
                style={[styles.sectorChip, isSelected && styles.sectorChipSelected]}
              >
                <View style={styles.chipHeader}>
                  <Text style={[styles.sectorChipText, isSelected && styles.sectorChipTextSelected]}>
                    {sec.name}
                  </Text>
                  {isSelected && <CheckCircle size={14} color="#FFF" style={{ marginLeft: 4 }} />}
                </View>
                <Text style={[styles.zoneText, isSelected && styles.zoneTextSelected]}>{sec.zone}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <GlassButton
          title="Complete Citizen Registration"
          onPress={handleRegister}
          loading={loading}
          variant="primary"
          style={styles.submitButton}
        />
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
  card: {
    padding: 24,
  },
  row: {
    flexDirection: 'row',
  },
  sectorLabel: {
    ...Typography.footnoteMedium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  sectorPicker: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  sectorChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 10,
  },
  sectorChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectorChipText: {
    ...Typography.footnoteMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  sectorChipTextSelected: {
    color: Colors.textInverse,
  },
  zoneText: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  zoneTextSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  submitButton: {
    marginTop: 10,
  },
});
