import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Mic, Square, Trash2, Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string, durationSec: number) => void;
  onCancel: () => void;
}

export function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(0);

  React.useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(false);
  };

  const handleSend = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRecordingComplete('mock_voice_note.m4a', seconds);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GlassCard style={styles.container} intensity={60}>
      <View style={styles.leftGroup}>
        <View style={[styles.micPulse, isRecording && styles.micPulsing]}>
          <Mic size={20} color={Colors.danger} />
        </View>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        <Text style={styles.recordingLabel}>{isRecording ? 'Recording voice note...' : 'Voice Note Ready'}</Text>
      </View>

      <View style={styles.rightGroup}>
        <TouchableOpacity onPress={onCancel} style={styles.iconBtn}>
          <Trash2 size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        {isRecording ? (
          <TouchableOpacity onPress={handleStop} style={[styles.iconBtn, styles.stopBtn]}>
            <Square size={16} color={Colors.surface} fill={Colors.surface} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSend} style={[styles.iconBtn, styles.sendBtn]}>
            <Send size={18} color={Colors.surface} />
          </TouchableOpacity>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micPulse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  micPulsing: {
    borderWidth: 2,
    borderColor: Colors.danger,
  },
  timerText: {
    ...Typography.title3,
    color: Colors.text,
    fontVariant: ['tabular-nums'],
    marginRight: 8,
  },
  recordingLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  stopBtn: {
    backgroundColor: Colors.danger,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
  },
});
