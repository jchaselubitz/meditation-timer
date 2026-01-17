import { useKeepAwake } from "expo-keep-awake";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  ActionButton,
  DurationPicker,
  HealthKitStatus,
  TimerDisplay,
  VolumeSlider,
} from "../components";
import { Colors, Spacing } from "../constants";
import { useSettings, useTimer } from "../hooks";
import {
  initializeHealthKit,
  isHealthKitAvailable,
  saveMindfulSession,
} from "../lib/healthKit";

export default function MeditationScreen() {
  const [healthKitConnected, setHealthKitConnected] = useState(false);
  const [healthKitAvailable, setHealthKitAvailable] = useState(false);

  useEffect(() => {
    isHealthKitAvailable().then(setHealthKitAvailable);
  }, []);

  const { settings, setDuration, setGongVolume } = useSettings();
  const {
    timerState,
    formattedTime,
    startTimer,
    stopTimer,
    isOvertime,
    targetSeconds,
  } = useTimer();

  // Keep screen awake during meditation
  useKeepAwake();

  const connectHealthKit = useCallback(async () => {
    const connected = await initializeHealthKit();
    setHealthKitConnected(connected);
    if (!connected && healthKitAvailable) {
      Alert.alert(
        "Health Access",
        "Please enable Health access in Settings to track your meditation sessions.",
        [{ text: "OK" }],
      );
    }
  }, [healthKitAvailable]);

  useEffect(() => {
    if (healthKitAvailable) {
      connectHealthKit();
    }
  }, [healthKitAvailable, connectHealthKit]);

  const handleStart = () => {
    startTimer(settings.durationMinutes, settings.gongVolume);
  };

  const handleStop = async () => {
    const session = stopTimer();

    if (healthKitConnected && session.actualDuration > 0) {
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

  const isTimerActive = timerState !== "idle";

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
          />

          <DurationPicker
            duration={settings.durationMinutes}
            onDurationChange={setDuration}
            disabled={isTimerActive}
          />

          <VolumeSlider
            volume={settings.gongVolume}
            onVolumeChange={setGongVolume}
            disabled={isTimerActive}
          />

          <ActionButton
            timerState={timerState}
            onStart={handleStart}
            onStop={handleStop}
          />

          <HealthKitStatus
            isConnected={healthKitConnected}
            isAvailable={healthKitAvailable}
            onConnect={connectHealthKit}
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
