import React, { createContext, useCallback, useContext, useState } from "react";

import { TimerSettings } from "../types";

const DEFAULT_SETTINGS: TimerSettings = {
  durationMinutes: 10,
  gongVolume: 0.7,
};

type SettingsContextValue = {
  settings: TimerSettings;
  setDuration: (minutes: number) => void;
  setGongVolume: (volume: number) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);

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
