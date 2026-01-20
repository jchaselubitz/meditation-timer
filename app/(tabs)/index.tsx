import { useKeepAwake } from "expo-keep-awake";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionButton, TimerDisplay } from "../../components";
import { Colors, Spacing } from "../../constants";
import { useSettings } from "../../contexts";
import { useTimer } from "../../hooks";
import { isHealthKitAvailable, saveMindfulSession } from "../../lib/healthKit";

export default function MeditationScreen() {
  const { settings } = useSettings();
  const {
    timerState,
    elapsedSeconds,
    formattedTime,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    isOvertime,
    targetSeconds,
  } = useTimer();

  // Keep screen awake during meditation
  useKeepAwake();

  const handleStart = () => {
    startTimer(settings.durationMinutes, settings.gongVolume);
  };

  const handleStop = async () => {
    const currentElapsedSeconds = elapsedSeconds;
    const session = stopTimer();
    const healthKitAvailable = await isHealthKitAvailable();
    if (healthKitAvailable && currentElapsedSeconds > 59) {
      const saved = await saveMindfulSession(
        session.startTime,
        session.endTime,
      );
      if (saved) {
        Alert.alert(
          "Session Complete",
          `Your ${formatDuration(session.actualDuration)} meditation has been saved to Apple Health.`,
          [{ text: "OK" }],
        );
      } else {
        Alert.alert(
          "Session Complete",
          `You meditated for ${formatDuration(session.actualDuration)}. (Could not save to Health)`,
          [{ text: "OK" }],
        );
      }
    } else {
      Alert.alert(
        "Session Complete",
        `You meditated for ${formatDuration(session.actualDuration)}.`,
        [{ text: "OK" }],
      );
    }
  };

  const handlePauseToggle = () => {
    if (timerState === "paused") {
      resumeTimer();
      return;
    }
    pauseTimer();
  };

  const handleReset = () => {
    resetTimer();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs} second${secs !== 1 ? "s" : ""}`;
    }
    if (secs === 0) {
      return `${mins} minute${mins !== 1 ? "s" : ""}`;
    }
    return `${mins} minute${mins !== 1 ? "s" : ""} and ${secs} second${secs !== 1 ? "s" : ""}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          <TimerDisplay
            time={
              timerState === "idle"
                ? formatMinutes(settings.durationMinutes)
                : formattedTime
            }
            timerState={timerState}
            isOvertime={isOvertime}
            progress={
              targetSeconds > 0
                ? Math.min(1, elapsedSeconds / targetSeconds)
                : 0
            }
          />

          <ActionButton
            timerState={timerState}
            onStart={handleStart}
            onStop={handleStop}
            onPauseToggle={handlePauseToggle}
            onReset={handleReset}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatMinutes(minutes: number): string {
  return `${minutes.toString().padStart(2, "0")}:00`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
});
