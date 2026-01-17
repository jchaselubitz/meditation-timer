import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants';
import { TimerState } from '../types';

interface TimerDisplayProps {
  time: string;
  timerState: TimerState;
  isOvertime: boolean;
}

export function TimerDisplay({ time, timerState, isOvertime }: TimerDisplayProps) {
  const getStatusText = () => {
    switch (timerState) {
      case 'idle':
        return 'Ready to meditate';
      case 'running':
        return 'Time remaining';
      case 'overtime':
        return 'Overtime';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{getStatusText()}</Text>
      <Text style={[styles.timerText, isOvertime && styles.overtimeText]}>
        {isOvertime ? `+${time}` : time}
      </Text>
      {isOvertime && (
        <Text style={styles.overtimeHint}>Press stop when ready</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  statusText: {
    color: Colors.textMuted,
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  timerText: {
    color: Colors.text,
    fontSize: FontSizes.timer,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
  overtimeText: {
    color: Colors.success,
  },
  overtimeHint: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: Spacing.md,
  },
});
