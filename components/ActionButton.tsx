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
  onStart: () => void | Promise<void>;
  onStop: () => void | Promise<void>;
  onPauseToggle: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
}

export function ActionButton({
  timerState,
  onStart,
  onStop,
  onPauseToggle,
  onReset,
}: ActionButtonProps) {
  const isSessionActive = timerState !== "idle";
  const isPaused = timerState === "paused";
  const useGlass = Platform.OS === "ios" && isLiquidGlassAvailable();

  const handleCenterPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isSessionActive) {
      await onStop();
    } else {
      await onStart();
    }
  };

  const handlePausePress = async () => {
    if (!isSessionActive) {
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await onPauseToggle();
  };

  const handleResetPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await onReset();
  };

  const gradientColors = isSessionActive
    ? (Gradients.water as [string, string, string])
    : (Gradients.sunsetSimple as [string, string]);

  const tintColor = isSessionActive ? Colors.waterLight : Colors.sunsetStart;

  if (useGlass) {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {/* Reset */}
          <TouchableOpacity
            onPress={handleResetPress}
            activeOpacity={0.8}
            style={styles.sideButtonWrapper}
            disabled={!isSessionActive}
          >
            <GlassView
              glassEffectStyle="thin"
              tintColor={Colors.surfaceLight}
              style={[
                styles.sideButton,
                !isSessionActive && styles.sideButtonDisabled,
              ]}
            >
              <Ionicons name="refresh" size={20} color={Colors.text} />
            </GlassView>
          </TouchableOpacity>

          {/* Start / Stop */}
          <TouchableOpacity
            onPress={handleCenterPress}
            activeOpacity={0.8}
            style={styles.buttonWrapper}
          >
            <GlassView
              glassEffectStyle="regular"
              tintColor={tintColor}
              style={styles.button}
            >
              <Ionicons
                name={isSessionActive ? "stop" : "play"}
                size={32}
                color={Colors.text}
                style={!isSessionActive && styles.playIcon}
              />
              <Text style={styles.buttonText}>
                {isSessionActive ? "Stop" : "Start"}
              </Text>
            </GlassView>
          </TouchableOpacity>

          {/* Pause / Resume */}
          <TouchableOpacity
            onPress={handlePausePress}
            activeOpacity={0.8}
            style={styles.sideButtonWrapper}
            disabled={!isSessionActive}
          >
            <GlassView
              glassEffectStyle="thin"
              tintColor={Colors.surfaceLight}
              style={[
                styles.sideButton,
                !isSessionActive && styles.sideButtonDisabled,
              ]}
            >
              <Ionicons
                name={isPaused ? "play" : "pause"}
                size={20}
                color={Colors.text}
              />
            </GlassView>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Reset */}
        <TouchableOpacity
          onPress={handleResetPress}
          activeOpacity={0.8}
          style={styles.sideButtonWrapper}
          disabled={!isSessionActive}
        >
          <LinearGradient
            colors={[Colors.surfaceLight, Colors.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.sideButton,
              !isSessionActive && styles.sideButtonDisabled,
            ]}
          >
            <Ionicons name="refresh" size={20} color={Colors.text} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Start / Stop */}
        <TouchableOpacity
          onPress={handleCenterPress}
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
              name={isSessionActive ? "stop" : "play"}
              size={32}
              color={Colors.text}
              style={!isSessionActive && styles.playIcon}
            />
            <Text style={styles.buttonText}>
              {isSessionActive ? "Stop" : "Start"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Pause / Resume */}
        <TouchableOpacity
          onPress={handlePausePress}
          activeOpacity={0.8}
          style={styles.sideButtonWrapper}
          disabled={!isSessionActive}
        >
          <LinearGradient
            colors={[Colors.surfaceLight, Colors.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.sideButton,
              !isSessionActive && styles.sideButtonDisabled,
            ]}
          >
            <Ionicons
              name={isPaused ? "play" : "pause"}
              size={20}
              color={Colors.text}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
  },
  buttonWrapper: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderRadius: BorderRadius.full,
  },
  sideButtonWrapper: {
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
  sideButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sideButtonDisabled: {
    opacity: 0.4,
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
