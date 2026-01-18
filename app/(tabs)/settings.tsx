import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DurationPicker,
  HealthKitStatus,
  VolumeSlider,
} from "../../components";
import { Colors, FontSizes, Spacing } from "../../constants";
import { useSettings } from "../../contexts";
import { initializeHealthKit, isHealthKitAvailable } from "../../lib/healthKit";

export default function SettingsScreen() {
  const [healthKitConnected, setHealthKitConnected] = useState(false);
  const [healthKitAvailable, setHealthKitAvailable] = useState(false);
  const { settings, setDuration, setGongVolume } = useSettings();

  useEffect(() => {
    setHealthKitAvailable(isHealthKitAvailable());
  }, []);

  const connectHealthKit = useCallback(async () => {
    const result = await initializeHealthKit();
    setHealthKitConnected(result.connected);
    if (!result.connected) {
      Alert.alert(
        "Apple Health",
        result.errorMessage ||
          "Please enable Apple Health access to track your meditation sessions.",
        [{ text: "OK" }],
      );
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Adjust your session defaults.</Text>

          <DurationPicker
            duration={settings.durationMinutes}
            onDurationChange={setDuration}
          />

          <VolumeSlider
            volume={settings.gongVolume}
            onVolumeChange={setGongVolume}
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
    paddingBottom: Spacing.xl,
  },
  title: {
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
});
