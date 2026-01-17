import { Ionicons } from "@expo/vector-icons";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BorderRadius, Colors, FontSizes, Spacing } from "../constants";

interface HealthKitStatusProps {
  isConnected: boolean;
  isAvailable: boolean;
  onConnect: () => void;
}

export function HealthKitStatus({
  isConnected,
  isAvailable,
  onConnect,
}: HealthKitStatusProps) {
  const useGlass = Platform.OS === "ios" && isLiquidGlassAvailable();

  if (!isAvailable) {
    return null;
  }

  const buttonContent = (
    <>
      <Ionicons
        name={isConnected ? "heart" : "heart-outline"}
        size={18}
        color={isConnected ? Colors.sunsetStart : Colors.textDark}
      />
      <Text style={[styles.text, isConnected && styles.connectedText]}>
        {isConnected ? "Apple Health connected" : "Tap to connect Apple Health"}
      </Text>
    </>
  );

  if (useGlass && !isConnected) {
    return (
      <TouchableOpacity onPress={onConnect} style={styles.touchable}>
        <GlassView
          glassEffectStyle="regular"
          tintColor={Colors.surfaceLight}
          style={styles.glassContainer}
        >
          {buttonContent}
        </GlassView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={!isConnected ? onConnect : undefined}
      disabled={isConnected}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  touchable: {
    alignSelf: "center",
    borderRadius: BorderRadius.full,
  },
  glassContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  text: {
    color: Colors.textDark,
    fontSize: FontSizes.sm,
  },
  connectedText: {
    color: Colors.textMuted,
  },
});
