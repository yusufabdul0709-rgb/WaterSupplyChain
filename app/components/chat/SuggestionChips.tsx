import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Sparkles, Clock, Receipt, AlertCircle, Building, Gauge } from 'lucide-react-native';
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

  const getChipIcon = (item: string) => {
    const lower = item.toLowerCase();
    if (lower.includes('schedule')) return <Clock size={12} color={Colors.primary} />;
    if (lower.includes('bill')) return <Receipt size={12} color={Colors.primary} />;
    if (lower.includes('complaint')) return <AlertCircle size={12} color={Colors.primary} />;
    if (lower.includes('office')) return <Building size={12} color={Colors.primary} />;
    if (lower.includes('pressure')) return <Gauge size={12} color={Colors.primary} />;
    return <Sparkles size={12} color={Colors.primary} />;
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
          activeOpacity={0.75}
          onPress={() => handlePress(item)}
          style={styles.chip}
        >
          <View style={styles.iconBox}>{getChipIcon(item)}</View>
          <Text style={styles.chipText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 46,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    marginRight: 6,
  },
  chipText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
