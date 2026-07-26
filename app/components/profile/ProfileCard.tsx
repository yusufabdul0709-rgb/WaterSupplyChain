import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { CitizenUser } from '../../store/authStore';

interface ProfileCardProps {
  user: CitizenUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <GlassCard style={styles.card} intensity={50} variant="elevated">
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={14} color={Colors.success} />
              <Text style={styles.verifiedText}>VERIFIED CITIZEN</Text>
            </View>
          </View>

          <Text style={styles.phone}>{user.phone}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.idsRow}>
        <View style={styles.idBox}>
          <Text style={styles.idLabel}>CONSUMER ID</Text>
          <Text style={styles.idValue}>{user.consumerId}</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.idBox}>
          <Text style={styles.idLabel}>CONNECTION ID</Text>
          <Text style={styles.idValue}>{user.connectionId}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatarText: {
    ...Typography.title1,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    ...Typography.title3,
    color: Colors.text,
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    ...Typography.caption2,
    color: Colors.success,
    fontWeight: '700',
    marginLeft: 2,
  },
  phone: {
    ...Typography.subhead,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  email: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 16,
  },
  idsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idBox: {
    flex: 1,
    alignItems: 'center',
  },
  idLabel: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  idValue: {
    ...Typography.subheadMedium,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.divider,
  },
});
