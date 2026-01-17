import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import { Colors, FontSizes, Gradients, Spacing } from "../constants";
import { TimerState } from "../types";

interface TimerDisplayProps {
  time: string;
  timerState: TimerState;
  isOvertime: boolean;
  progress: number; // 0-1, proportion of time elapsed
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const TIMER_SIZE = SCREEN_WIDTH * 0.75;
const TICK_COUNT = 60; // Full circle with tick marks

export function TimerDisplay({
  time,
  timerState,
  isOvertime,
  progress,
}: TimerDisplayProps) {
  const getStatusText = () => {
    switch (timerState) {
      case "idle":
        return "Ready to meditate";
      case "running":
        return "Time remaining";
      case "overtime":
        return "Overtime";
      default:
        return "";
    }
  };

  const gradientColors = isOvertime
    ? (Gradients.timerOvertime as [string, string])
    : timerState === "running"
      ? (Gradients.timerActive as [string, string])
      : (Gradients.sunsetSimple as [string, string]);

  return (
    <View style={styles.container}>
      <View style={styles.timerWrapper}>
        {/* Outer glow effect */}
        <View style={[styles.glow, isOvertime && styles.glowOvertime]} />

        {/* Main timer circle */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.timerCircle}
        >
          {/* Wave/water overlay at bottom */}
          <View style={styles.waveContainer}>
            <LinearGradient
              colors={Gradients.waterDeep as [string, string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.wave}
            />
          </View>

          {/* Tick marks around the circle showing progress */}
          <View style={styles.ticksContainer}>
            {Array.from({ length: TICK_COUNT }).map((_, index) => {
              // Start at top (-90°) and go clockwise around the full circle
              const angle = -90 + (index * 360) / TICK_COUNT;
              const radians = (angle * Math.PI) / 180;
              const radius = TIMER_SIZE / 2 - 20;
              const x = Math.cos(radians) * radius;
              const y = Math.sin(radians) * radius;

              // Calculate if this tick should be active based on progress
              // Progress goes from 0 to 1, ticks go from index 0 to TICK_COUNT-1
              const tickProgress = index / TICK_COUNT;
              const isActive = tickProgress < progress;

              // Make every 5th tick (hour markers) slightly larger
              const isMajorTick = index % 5 === 0;

              return (
                <View
                  key={index}
                  style={[
                    styles.tick,
                    isMajorTick && styles.majorTick,
                    isActive && styles.tickActive,
                    isActive && isOvertime && styles.tickOvertime,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: `${angle + 90}deg` },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Timer text */}
          <View style={styles.textContainer}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            <Text style={styles.timerText}>
              {isOvertime ? `+${time}` : time}
            </Text>
            {isOvertime && (
              <Text style={styles.overtimeHint}>Press stop when ready</Text>
            )}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
  },
  timerWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: TIMER_SIZE + 20,
    height: TIMER_SIZE + 20,
    borderRadius: (TIMER_SIZE + 20) / 2,
    backgroundColor: Colors.primaryMuted,
    opacity: 0.3,
  },
  glowOvertime: {
    backgroundColor: Colors.overtime,
    opacity: 0.4,
  },
  timerCircle: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TIMER_SIZE * 0.45,
    overflow: "hidden",
  },
  wave: {
    flex: 1,
    borderTopLeftRadius: TIMER_SIZE * 0.3,
    borderTopRightRadius: TIMER_SIZE * 0.5,
  },
  ticksContainer: {
    position: "absolute",
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    position: "absolute",
    width: 3,
    height: 12,
    backgroundColor: Colors.textDark,
    borderRadius: 2,
    opacity: 0.4,
  },
  majorTick: {
    height: 18,
    width: 4,
    opacity: 0.6,
  },
  tickActive: {
    backgroundColor: Colors.text,
    opacity: 0.95,
  },
  tickOvertime: {
    backgroundColor: Colors.overtime,
    opacity: 0.95,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  statusText: {
    color: Colors.text,
    fontSize: FontSizes.xs,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 2,
    opacity: 0.8,
  },
  timerText: {
    color: Colors.text,
    fontSize: FontSizes.timer,
    fontWeight: "200",
    fontVariant: ["tabular-nums"],
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  overtimeHint: {
    color: Colors.text,
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
});
