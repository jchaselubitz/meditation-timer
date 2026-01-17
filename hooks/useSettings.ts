import { useCallback, useState } from "react";

import { TimerSettings } from "../types";

const DEFAULT_SETTINGS: TimerSettings = {
  durationMinutes: 10,
  gongVolume: 0.7,
};

export function useSettings() {
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

  return {
    settings,
    setDuration,
    setGongVolume,
  };
}
