import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius } from '../../constants/theme';

interface OTPInputProps {
  length?: number;
  onCodeFilled: (code: string) => void;
}

export function OTPInput({ length = 6, onCodeFilled }: OTPInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChangeText = (text: string, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto advance to next box
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newCode.join('');
    if (fullCode.length === length && !fullCode.includes('')) {
      onCodeFilled(fullCode);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <View
            key={i}
            style={[
              styles.box,
              code[i] ? styles.boxFilled : null,
              inputRefs.current[i]?.isFocused() ? styles.boxFocused : null,
            ]}
          >
            <TextInput
              ref={(ref) => {
                inputRefs.current[i] = ref;
              }}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              value={code[i]}
              onChangeText={(text) => handleChangeText(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              selectTextOnFocus
            />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxFilled: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  boxFocused: {
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  input: {
    ...Typography.title2,
    color: Colors.text,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
});
