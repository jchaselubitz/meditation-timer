import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { loadGongSound, unloadGongSound } from '../lib/audio';
import { Colors } from '../constants';

export default function RootLayout() {
  useEffect(() => {
    // Preload audio on app start
    loadGongSound();

    return () => {
      unloadGongSound();
    };
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
