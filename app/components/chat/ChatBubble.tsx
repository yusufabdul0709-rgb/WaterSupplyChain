import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Bot, User } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
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
        <Bot size={18} color={Colors.primary} />
      </View>
      <GlassCard style={styles.aiCard} intensity={45}>
        <Text style={styles.aiText}>{message.text}</Text>
        <Text style={styles.aiTime}>{message.timestamp}</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
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
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  userText: {
    ...Typography.body,
    color: Colors.textInverse,
    fontSize: 15,
  },
  userTime: {
    ...Typography.caption2,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  aiCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
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
    marginTop: 4,
  },
});
