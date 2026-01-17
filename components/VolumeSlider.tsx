import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants';
import { previewGong } from '../lib/audio';

interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  disabled?: boolean;
}

export function VolumeSlider({ volume, onVolumeChange, disabled }: VolumeSliderProps) {
  const handleSlidingComplete = async (value: number) => {
    onVolumeChange(value);
    if (value > 0) {
      await previewGong(value);
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Text style={styles.label}>Gong Volume</Text>

      <View style={styles.sliderContainer}>
        <Ionicons
          name="volume-low"
          size={24}
          color={Colors.textMuted}
        />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={onVolumeChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.secondary}
          thumbTintColor={Colors.text}
          disabled={disabled}
        />
        <Ionicons
          name="volume-high"
          size={24}
          color={Colors.textMuted}
        />
      </View>

      <Text style={styles.volumeText}>
        {Math.round(volume * 100)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumeText: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
