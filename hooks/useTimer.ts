import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerState } from '../types';
import { playGong } from '../lib/audio';

interface UseTimerReturn {
  timerState: TimerState;
  elapsedSeconds: number;
  targetSeconds: number;
  startTimer: (durationMinutes: number, gongVolume: number) => void;
  stopTimer: () => { startTime: Date; endTime: Date; actualDuration: number };
  resetTimer: () => void;
  formattedTime: string;
  isOvertime: boolean;
  overtimeSeconds: number;
}

export function useTimer(): UseTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const gongPlayedRef = useRef(false);
  const gongVolumeRef = useRef(1.0);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback((durationMinutes: number, gongVolume: number) => {
    const target = durationMinutes * 60;
    setTargetSeconds(target);
    setElapsedSeconds(0);
    setOvertimeSeconds(0);
    setTimerState('running');
    startTimeRef.current = new Date();
    gongPlayedRef.current = false;
    gongVolumeRef.current = gongVolume;

    clearTimerInterval();

    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const newElapsed = prev + 1;

        // Check if we've reached the target
        if (newElapsed >= target && !gongPlayedRef.current) {
          gongPlayedRef.current = true;
          playGong(gongVolumeRef.current);
          setTimerState('overtime');
        }

        // Calculate overtime
        if (newElapsed > target) {
          setOvertimeSeconds(newElapsed - target);
        }

        return newElapsed;
      });
    }, 1000);
  }, [clearTimerInterval]);

  const stopTimer = useCallback(() => {
    clearTimerInterval();
    const endTime = new Date();
    const startTime = startTimeRef.current || new Date();
    const actualDuration = elapsedSeconds;

    setTimerState('idle');

    return {
      startTime,
      endTime,
      actualDuration,
    };
  }, [clearTimerInterval, elapsedSeconds]);

  const resetTimer = useCallback(() => {
    clearTimerInterval();
    setTimerState('idle');
    setElapsedSeconds(0);
    setOvertimeSeconds(0);
    setTargetSeconds(0);
    startTimeRef.current = null;
    gongPlayedRef.current = false;
  }, [clearTimerInterval]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedTime = timerState === 'overtime'
    ? formatTime(overtimeSeconds)
    : formatTime(timerState === 'idle' ? targetSeconds : Math.max(0, targetSeconds - elapsedSeconds));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  return {
    timerState,
    elapsedSeconds,
    targetSeconds,
    startTimer,
    stopTimer,
    resetTimer,
    formattedTime,
    isOvertime: timerState === 'overtime',
    overtimeSeconds,
  };
}
