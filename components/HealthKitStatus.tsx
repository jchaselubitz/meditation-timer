import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants';

interface HealthKitStatusProps {
  isConnected: boolean;
  isAvailable: boolean;
  onConnect: () => void;
}

export function HealthKitStatus({ isConnected, isAvailable, onConnect }: HealthKitStatusProps) {
  if (!isAvailable) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={!isConnected ? onConnect : undefined}
      disabled={isConnected}
    >
      <Ionicons
        name={isConnected ? 'heart' : 'heart-outline'}
        size={18}
        color={isConnected ? Colors.sunsetStart : Colors.textDark}
      />
      <Text style={[styles.text, isConnected && styles.connectedText]}>
        {isConnected ? 'Apple Health connected' : 'Tap to connect Apple Health'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  text: {
    color: Colors.textDark,
    fontSize: FontSizes.sm,
  },
  connectedText: {
    color: Colors.textMuted,
  },
});
