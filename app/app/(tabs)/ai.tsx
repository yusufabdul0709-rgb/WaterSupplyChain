import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bot, Send, Mic, Globe, Sparkles } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { ChatBubble, ChatMessage } from '../../components/chat/ChatBubble';
import { VoiceRecorder } from '../../components/chat/VoiceRecorder';
import { SuggestionChips } from '../../components/chat/SuggestionChips';
import { AI_FAQ_DATABASE, DEFAULT_AI_RESPONSE } from '../../data/mockAIResponses';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'ai',
    text: 'Hello Ramesh! I am the GVMC Smart Water AI Assistant. Ask me about water supply timings, report grievances, check billing tariffs, or AMRUT 2.0 schemes.',
    timestamp: 'Just now',
  },
];

const SUGGESTIONS = [
  'Today\'s supply schedule',
  'Report low pressure',
  'Water bill tariffs',
  'New connection process',
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

    // Generate AI Bot Answer
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

      // Voice Output option
      Speech.speak(botAnswer.slice(0, 150), { language: language === 'TE' ? 'te-IN' : 'en-US' });
    }, 1000);
  };

  const toggleLanguage = () => {
    const next = language === 'EN' ? 'TE' : language === 'TE' ? 'HI' : 'EN';
    setLanguage(next);
    Haptics.selectionAsync();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTitleGroup}>
          <View style={styles.botIconCircle}>
            <Bot size={22} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.botName}>GVMC Water AI</Text>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Multilingual · Active</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={toggleLanguage} style={styles.langBtn}>
          <Globe size={16} color={Colors.primary} />
          <Text style={styles.langText}>{language}</Text>
        </TouchableOpacity>
      </View>

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
              <Text style={styles.typingText}>GVMC AI generating answer...</Text>
            </View>
          ) : null
        }
      />

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 80 }]}>
        <SuggestionChips suggestions={SUGGESTIONS} onSelect={(t) => handleSend(t)} />

        {isRecording ? (
          <VoiceRecorder
            onRecordingComplete={(uri, dur) => {
              setIsRecording(false);
              handleSend(`[Voice Note ${dur}s]: "Report low pressure in Ward 42"`);
            }}
            onCancel={() => setIsRecording(false)}
          />
        ) : (
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder={`Ask GVMC AI in ${language === 'TE' ? 'Telugu' : language === 'HI' ? 'Hindi' : 'English'}...`}
              placeholderTextColor={Colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />

            <TouchableOpacity onPress={() => setIsRecording(true)} style={styles.micBtn}>
              <Mic size={20} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSend()}
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              disabled={!inputText.trim()}
            >
              <Send size={18} color={Colors.textInverse} />
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
    backgroundColor: 'rgba(246, 248, 251, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  botName: {
    ...Typography.title3,
    color: Colors.text,
    fontSize: 18,
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
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 91, 172, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  langText: {
    ...Typography.caption1,
    color: Colors.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  chatContent: {
    paddingHorizontal: Spacing.screen,
    paddingVertical: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  typingText: {
    ...Typography.caption1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 28,
    marginHorizontal: Spacing.screen,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    fontSize: 15,
  },
  micBtn: {
    padding: 6,
    marginRight: 4,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
