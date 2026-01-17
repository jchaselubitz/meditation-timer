import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, FontSizes, Spacing } from '../constants';
import { TimerState } from '../types';

interface ActionButtonProps {
  timerState: TimerState;
  onStart: () => void;
  onStop: () => void;
}

export function ActionButton({ timerState, onStart, onStop }: ActionButtonProps) {
  const isRunning = timerState === 'running' || timerState === 'overtime';

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRunning) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRunning && styles.stopButton]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isRunning ? 'stop' : 'play'}
          size={36}
          color={Colors.text}
          style={!isRunning && styles.playIcon}
        />
        <Text style={styles.buttonText}>
          {isRunning ? 'Stop' : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: 40,
    gap: Spacing.sm,
    minWidth: 160,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButton: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
  },
  playIcon: {
    marginLeft: 4,
  },
  buttonText: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
});
