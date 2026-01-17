import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { TimerSettings } from "../types";

const DEFAULT_SETTINGS: TimerSettings = {
  durationMinutes: 10,
  gongVolume: 0.7,
};

const SETTINGS_STORAGE_KEY = "@meditation_timer_settings";

type SettingsContextValue = {
  settings: TimerSettings;
  setDuration: (minutes: number) => void;
  setGongVolume: (volume: number) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as TimerSettings;
          setSettings(parsed);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    };

    saveSettings();
  }, [settings, isLoaded]);

  const setDuration = useCallback((minutes: number) => {
    setSettings((prev) => ({
      ...prev,
      durationMinutes: Math.max(1, Math.min(180, minutes)),
    }));
  }, []);

  const setGongVolume = useCallback((volume: number) => {
    setSettings((prev) => ({
      ...prev,
      gongVolume: Math.max(0, Math.min(1, volume)),
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setDuration, setGongVolume }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
