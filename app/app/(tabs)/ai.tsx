import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bot, Send, Mic, Globe, Sparkles, Image as ImageIcon, FileText, History, ShieldCheck } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { ChatBubble, ChatMessage } from '../../components/chat/ChatBubble';
import { VoiceRecorder } from '../../components/chat/VoiceRecorder';
import { SuggestionChips } from '../../components/chat/SuggestionChips';
import { AI_FAQ_DATABASE, DEFAULT_AI_RESPONSE } from '../../data/mockAIResponses';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'ai',
    text: 'Namaste Ramesh! I am the GVMC Smart Water AI Digital Assistant. Ask me about your water supply slots, report leaks or low pressure, inspect water bills, or check AMRUT 2.0 schemes.',
    timestamp: 'Just now',
  },
];

const SUGGESTIONS = [
  'Today\'s Schedule',
  'Water Bill',
  'Complaint',
  'Nearby Office',
  'Water Pressure',
];

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'EN' | 'TE' | 'HI'>('EN');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI Streaming Response & Matching Backend Knowledge Base
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let botAnswer = DEFAULT_AI_RESPONSE[language.toLowerCase() as 'en' | 'te' | 'hi'];

      for (const faq of AI_FAQ_DATABASE) {
        if (faq.queryKeywords.some((k) => lower.includes(k))) {
          botAnswer =
            language === 'TE' ? faq.responseTe : language === 'HI' ? faq.responseHi : faq.responseEn;
          break;
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: botAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      // Optional Speech synthesis
      Speech.speak(botAnswer.slice(0, 150), { language: language === 'TE' ? 'te-IN' : 'en-US' });
    }, 1000);
  };

  const toggleLanguage = () => {
    const next = language === 'EN' ? 'TE' : language === 'TE' ? 'HI' : 'EN';
    setLanguage(next);
    Haptics.selectionAsync();
  };

  const handleImageUpload = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleSend('[Attached Image]: Water pipeline leakage photo from Ward 42');
  };

  const handleExportPDF = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('PDF Report Exported', 'GVMC Water Telemetry & AI Diagnosis Report saved to downloads folder.');
  };

  const handleShowHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Conversation History', 'Viewing 12 previous municipal query sessions.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Product AI Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleGroup}>
          <View style={styles.botIconCircle}>
            <Sparkles size={20} color="#FFF" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.botName}>GVMC Water AI</Text>
              <View style={styles.verifiedTag}>
                <ShieldCheck size={11} color={Colors.primary} />
                <Text style={styles.verifiedText}>Govt Verified</Text>
              </View>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online · Municipal Multilingual Intelligence</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShowHistory} style={styles.headerIconBtn}>
            <History size={16} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleLanguage} style={styles.langBtn}>
            <Globe size={14} color={Colors.primary} />
            <Text style={styles.langText}>{language}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Conversation Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContent}
        renderItem={({ item }) => <ChatBubble message={item} />}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingIndicator}>
              <Sparkles size={14} color={Colors.primary} />
              <Text style={styles.typingText}>GVMC AI analyzing water telemetry & generating response...</Text>
            </View>
          ) : null
        }
      />

      {/* Bottom Input Area with Quick Suggestions & Voice / Image Upload */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 74 }]}>
        <SuggestionChips suggestions={SUGGESTIONS} onSelect={(t) => handleSend(t)} />

        {isRecording ? (
          <VoiceRecorder
            onRecordingComplete={(uri, dur) => {
              setIsRecording(false);
              handleSend(`[Voice Note ${dur}s]: "Check water pressure level in Ward 42"`);
            }}
            onCancel={() => setIsRecording(false)}
          />
        ) : (
          <View style={styles.inputBar}>
            <TouchableOpacity onPress={handleImageUpload} style={styles.attachBtn}>
              <ImageIcon size={18} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleExportPDF} style={styles.attachBtn}>
              <FileText size={18} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder={`Ask GVMC AI in ${language === 'TE' ? 'Telugu' : language === 'HI' ? 'Hindi' : 'English'}...`}
              placeholderTextColor={Colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />

            <TouchableOpacity onPress={() => setIsRecording(true)} style={styles.micBtn}>
              <Mic size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSend()}
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              disabled={!inputText.trim()}
            >
              <Send size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 12,
    backgroundColor: 'rgba(245, 247, 250, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botName: {
    ...Typography.cardTitle,
    color: Colors.text,
    fontSize: 17,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginLeft: 6,
  },
  verifiedText: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 4,
  },
  onlineText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(0, 91, 172, 0.15)',
  },
  langText: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 4,
  },
  chatContent: {
    paddingHorizontal: Spacing.screen,
    paddingVertical: 14,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  typingText: {
    ...Typography.caption2,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 28,
    marginHorizontal: Spacing.screen,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  attachBtn: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    fontSize: 14,
    marginLeft: 4,
  },
  micBtn: {
    padding: 6,
    marginRight: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
