import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ShieldCheck, Phone, Mail } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';
import { CitizenUser } from '../../store/authStore';

interface ProfileCardProps {
  user: CitizenUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <GlassCard style={styles.card} intensity={40} variant="elevated">
      <View style={styles.header}>
        {/* Avatar with exact 26px radius (52x52 container) */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          <View style={styles.verifiedDot}>
            <ShieldCheck size={10} color="#FFF" />
          </View>
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color={Colors.success} />
              <Text style={styles.verifiedText}>Government Verified</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Phone size={12} color={Colors.textSecondary} />
            <Text style={styles.phone}>{user.phone}</Text>
          </View>

          {user.email && (
            <View style={styles.contactRow}>
              <Mail size={12} color={Colors.textTertiary} />
              <Text style={styles.email}>{user.email}</Text>
            </View>
          )}
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
    borderRadius: BorderRadius.card, // 24px
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.avatar, // Exact 26px
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    ...Typography.sectionTitle,
    color: '#FFF',
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
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    ...Typography.cardTitle,
    color: Colors.text,
    fontSize: 18,
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  verifiedText: {
    ...Typography.label,
    color: Colors.success,
    fontWeight: '700',
    fontSize: 10,
    marginLeft: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  phone: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  email: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
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
    ...Typography.label,
    color: Colors.textTertiary,
    fontSize: 10,
    letterSpacing: 1,
  },
  idValue: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 13,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
});
