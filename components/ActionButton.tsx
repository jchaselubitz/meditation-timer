import { Ionicons } from "@expo/vector-icons";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  BorderRadius,
  Colors,
  FontSizes,
  Gradients,
  Spacing,
} from "../constants";
import { TimerState } from "../types";

interface ActionButtonProps {
  timerState: TimerState;
  onStart: () => void;
  onStop: () => void;
}

export function ActionButton({
  timerState,
  onStart,
  onStop,
}: ActionButtonProps) {
  const isRunning = timerState === "running" || timerState === "overtime";
  const useGlass = Platform.OS === "ios" && isLiquidGlassAvailable();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRunning) {
      onStop();
    } else {
      onStart();
    }
  };

  const gradientColors = isRunning
    ? (Gradients.water as [string, string, string])
    : (Gradients.sunsetSimple as [string, string]);

  const tintColor = isRunning ? Colors.waterLight : Colors.sunsetStart;

  if (useGlass) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={styles.buttonWrapper}
        >
          <GlassView
            glassEffectStyle="regular"
            tintColor={tintColor}
            style={styles.button}
          >
            <Ionicons
              name={isRunning ? "stop" : "play"}
              size={32}
              color={Colors.text}
              style={!isRunning && styles.playIcon}
            />
            {/* <Text style={styles.buttonText}>
              {isRunning ? "Stop" : "Start"}
            </Text> */}
          </GlassView>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Ionicons
            name={isRunning ? "stop" : "play"}
            size={32}
            color={Colors.text}
            style={!isRunning && styles.playIcon}
          />
          <Text style={styles.buttonText}>{isRunning ? "Stop" : "Start"}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  buttonWrapper: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderRadius: BorderRadius.full,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  playIcon: {
    marginLeft: 4,
  },
  buttonText: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
