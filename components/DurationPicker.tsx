import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants';

interface DurationPickerProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  disabled?: boolean;
}

const PRESET_DURATIONS = [5, 10, 15, 20, 30, 45, 60];

export function DurationPicker({ duration, onDurationChange, disabled }: DurationPickerProps) {
  const increment = () => {
    if (!disabled) {
      onDurationChange(Math.min(180, duration + 1));
    }
  };

  const decrement = () => {
    if (!disabled) {
      onDurationChange(Math.max(1, duration - 1));
    }
  };

  const selectPreset = (preset: number) => {
    if (!disabled) {
      onDurationChange(preset);
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Text style={styles.label}>Duration</Text>

      <View style={styles.mainControl}>
        <TouchableOpacity
          onPress={decrement}
          style={styles.button}
          disabled={disabled}
        >
          <Ionicons
            name="remove-circle"
            size={44}
            color={disabled ? Colors.textDark : Colors.waterLight}
          />
        </TouchableOpacity>

        <View style={styles.durationDisplay}>
          <Text style={styles.durationText}>{duration}</Text>
          <Text style={styles.unitText}>min</Text>
        </View>

        <TouchableOpacity
          onPress={increment}
          style={styles.button}
          disabled={disabled}
        >
          <Ionicons
            name="add-circle"
            size={44}
            color={disabled ? Colors.textDark : Colors.waterLight}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.presets}>
        {PRESET_DURATIONS.map((preset) => (
          <TouchableOpacity
            key={preset}
            style={[
              styles.presetButton,
              duration === preset && styles.presetButtonActive,
            ]}
            onPress={() => selectPreset(preset)}
            disabled={disabled}
          >
            <Text style={[
              styles.presetText,
              duration === preset && styles.presetTextActive,
            ]}>
              {preset}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    textAlign: 'center',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  mainControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  button: {
    padding: Spacing.sm,
  },
  durationDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  durationText: {
    color: Colors.text,
    fontSize: FontSizes.xxl,
    fontWeight: '300',
  },
  unitText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  presetButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  presetButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  presetText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
  },
  presetTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
});
