import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Bot, User, Sparkles, ShieldCheck } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <View style={[styles.wrapper, styles.userWrapper]}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
          <Text style={styles.userTime}>{message.timestamp}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, styles.aiWrapper]}>
      <View style={styles.aiAvatar}>
        <Sparkles size={16} color="#FFF" />
      </View>

      <GlassCard style={styles.aiCard} intensity={40}>
        <View style={styles.aiBadgeRow}>
          <ShieldCheck size={12} color={Colors.primary} />
          <Text style={styles.aiBadgeText}>GVMC Verified AI</Text>
        </View>

        <Text style={styles.aiText}>{message.text}</Text>
        <Text style={styles.aiTime}>{message.timestamp}</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  aiWrapper: {
    justifyContent: 'flex-start',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.card, // 24px
    borderBottomRightRadius: 6,
    maxWidth: '82%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  userText: {
    ...Typography.body,
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
  },
  userTime: {
    ...Typography.caption2,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 4,
  },
  aiCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.card, // 24px
    borderBottomLeftRadius: 6,
    maxWidth: '82%',
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiBadgeText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  aiText: {
    ...Typography.body,
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  aiTime: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    marginTop: 6,
  },
});
