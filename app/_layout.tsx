import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { Colors } from "../constants";
import { SettingsProvider } from "../contexts";
import { loadGongSound, unloadGongSound } from "../lib/audio";
import { setupNotificationHandler } from "../lib/notificationSetup";

// Configure notification handler at module level (before any component renders)
setupNotificationHandler();

export default function RootLayout() {
  useEffect(() => {
    // Preload audio on app start
    loadGongSound();

    return () => {
      unloadGongSound();
    };
  }, []);

  return (
    <SettingsProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SettingsProvider>
  );
}
