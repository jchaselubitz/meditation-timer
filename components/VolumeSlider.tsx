import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { BorderRadius, Colors, FontSizes, Spacing } from "../constants";
import { previewGong } from "../lib/audio";

interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  disabled?: boolean;
}

export function VolumeSlider({
  volume,
  onVolumeChange,
  disabled,
}: VolumeSliderProps) {
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
        <Ionicons name="volume-low" size={24} color={Colors.textDark} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={onVolumeChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={Colors.accent}
          maximumTrackTintColor={Colors.surfaceLight}
          thumbTintColor={Colors.sunsetEnd}
          disabled={disabled}
        />
        <Ionicons name="volume-high" size={24} color={Colors.textDark} />
      </View>

      <Text style={styles.volumeText}>{Math.round(volume * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    textAlign: "center",
    marginBottom: Spacing.md,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumeText: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    textAlign: "center",
    marginTop: Spacing.xs,
    fontWeight: "500",
  },
});
