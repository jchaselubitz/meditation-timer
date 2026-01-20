import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { playGong } from "../lib/audio";
import {
  cancelTimerNotification,
  scheduleTimerNotification,
} from "../lib/notifications";
import { TimerState } from "../types";

interface UseTimerReturn {
  timerState: TimerState;
  elapsedSeconds: number;
  targetSeconds: number;
  startTimer: (durationMinutes: number, gongVolume: number) => void;
  stopTimer: () => { startTime: Date; endTime: Date; actualDuration: number };
  resetTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  formattedTime: string;
  isOvertime: boolean;
  overtimeSeconds: number;
}

export function useTimer(): UseTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetSecondsRef = useRef(0);
  const startTimeRef = useRef<Date | null>(null);
  const accumulatedSecondsRef = useRef(0);
  const gongPlayedRef = useRef(false);
  const gongVolumeRef = useRef(1.0);
  const notificationIdRef = useRef<string | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const getTotalElapsedSeconds = useCallback((): number => {
    if (!startTimeRef.current) {
      return accumulatedSecondsRef.current;
    }

    const now = new Date();
    const runElapsed = Math.floor(
      (now.getTime() - startTimeRef.current.getTime()) / 1000,
    );

    return accumulatedSecondsRef.current + Math.max(0, runElapsed);
  }, []);

  useEffect(() => {
    targetSecondsRef.current = targetSeconds;
  }, [targetSeconds]);

  const tick = useCallback(() => {
    const totalElapsed = getTotalElapsedSeconds();
    const target = targetSecondsRef.current;
    setElapsedSeconds(totalElapsed);

    if (totalElapsed >= target && !gongPlayedRef.current) {
      gongPlayedRef.current = true;
      playGong(gongVolumeRef.current);
      if (notificationIdRef.current) {
        void cancelTimerNotification(notificationIdRef.current);
        notificationIdRef.current = null;
      }
      setTimerState("overtime");
    }

    if (totalElapsed > target) {
      setOvertimeSeconds(totalElapsed - target);
    } else {
      setOvertimeSeconds(0);
    }
  }, [getTotalElapsedSeconds]);

  const startInterval = useCallback(() => {
    clearTimerInterval();
    intervalRef.current = setInterval(tick, 1000);
    tick();
  }, [clearTimerInterval, tick]);

  const startTimer = useCallback(
    (durationMinutes: number, gongVolume: number) => {
      const target = durationMinutes * 60;
      setTargetSeconds(target);
      targetSecondsRef.current = target;
      setElapsedSeconds(0);
      setOvertimeSeconds(0);
      setTimerState("running");
      startTimeRef.current = new Date();
      accumulatedSecondsRef.current = 0;
      gongPlayedRef.current = false;
      gongVolumeRef.current = gongVolume;

      startInterval();

      void (async () => {
        if (notificationIdRef.current) {
          await cancelTimerNotification(notificationIdRef.current);
          notificationIdRef.current = null;
        }
        notificationIdRef.current = await scheduleTimerNotification(target);
      })();
    },
    [startInterval],
  );

  const stopTimer = useCallback(() => {
    clearTimerInterval();
    const endTime = new Date();
    const startTime = startTimeRef.current || new Date();
    const totalElapsed = getTotalElapsedSeconds();
    accumulatedSecondsRef.current = totalElapsed;
    const actualDuration = totalElapsed;

    setElapsedSeconds(totalElapsed);
    if (totalElapsed > targetSeconds) {
      setOvertimeSeconds(totalElapsed - targetSeconds);
    }

    setTimerState("idle");
    startTimeRef.current = null;
    if (notificationIdRef.current) {
      void cancelTimerNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }

    return {
      startTime,
      endTime,
      actualDuration,
    };
  }, [clearTimerInterval, getTotalElapsedSeconds, targetSeconds]);

  const pauseTimer = useCallback(() => {
    if (timerState !== "running" && timerState !== "overtime") {
      return;
    }

    const totalElapsed = getTotalElapsedSeconds();
    accumulatedSecondsRef.current = totalElapsed;
    setElapsedSeconds(totalElapsed);

    if (totalElapsed > targetSeconds) {
      setOvertimeSeconds(totalElapsed - targetSeconds);
    }

    clearTimerInterval();
    startTimeRef.current = null;
    setTimerState("paused");

    if (notificationIdRef.current) {
      void cancelTimerNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
  }, [clearTimerInterval, getTotalElapsedSeconds, targetSeconds, timerState]);

  const resumeTimer = useCallback(() => {
    if (timerState !== "paused" || targetSeconds <= 0) {
      return;
    }

    startTimeRef.current = new Date();

    const currentElapsed = accumulatedSecondsRef.current;
    const remainingSeconds = Math.max(0, targetSeconds - currentElapsed);

    if (currentElapsed >= targetSeconds) {
      setTimerState("overtime");
    } else {
      setTimerState("running");
      void (async () => {
        if (notificationIdRef.current) {
          await cancelTimerNotification(notificationIdRef.current);
          notificationIdRef.current = null;
        }
        if (remainingSeconds > 0) {
          notificationIdRef.current =
            await scheduleTimerNotification(remainingSeconds);
        }
      })();
    }

    startInterval();
  }, [startInterval, targetSeconds, timerState]);

  const resetTimer = useCallback(() => {
    clearTimerInterval();
    setTimerState("idle");
    setElapsedSeconds(0);
    setOvertimeSeconds(0);
    setTargetSeconds(0);
    targetSecondsRef.current = 0;
    startTimeRef.current = null;
    accumulatedSecondsRef.current = 0;
    gongPlayedRef.current = false;
    if (notificationIdRef.current) {
      void cancelTimerNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
  }, [clearTimerInterval]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formattedTime =
    timerState === "overtime" ||
    (timerState === "paused" &&
      targetSeconds > 0 &&
      elapsedSeconds >= targetSeconds)
      ? formatTime(overtimeSeconds)
      : formatTime(
          timerState === "idle"
            ? targetSeconds
            : Math.max(0, targetSeconds - elapsedSeconds),
        );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (timerState === "running" || timerState === "overtime") {
        if (state === "active") {
          startInterval();
        } else {
          clearTimerInterval();
          // Don't reschedule notification here - the one from startTimer is already set
          // Rescheduling risks the app being suspended before the new notification is scheduled
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [clearTimerInterval, startInterval, timerState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimerInterval();
      if (notificationIdRef.current) {
        void cancelTimerNotification(notificationIdRef.current);
      }
    };
  }, [clearTimerInterval]);

  return {
    timerState,
    elapsedSeconds,
    targetSeconds,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
    formattedTime,
    isOvertime:
      timerState === "overtime" ||
      (timerState === "paused" &&
        targetSeconds > 0 &&
        elapsedSeconds >= targetSeconds),
    overtimeSeconds,
  };
}
