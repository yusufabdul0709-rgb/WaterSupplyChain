import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius } from '../../constants/theme';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  const handlePress = (text: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(text);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          onPress={() => handlePress(item)}
          style={styles.chip}
        >
          <Text style={styles.chipText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 44,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0, 91, 172, 0.2)',
    marginRight: 8,
  },
  chipText: {
    ...Typography.footnoteMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
});
