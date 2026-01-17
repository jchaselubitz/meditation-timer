import { z } from "zod";

export const MeditationSessionSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  targetDuration: z.number().min(0), // in seconds
  actualDuration: z.number().min(0), // in seconds
});

export type MeditationSession = z.infer<typeof MeditationSessionSchema>;

export const TimerSettingsSchema = z.object({
  durationMinutes: z.number().min(1).max(180),
  gongVolume: z.number().min(0).max(1),
});

export type TimerSettings = z.infer<typeof TimerSettingsSchema>;

export type TimerState = "idle" | "running" | "overtime" | "paused";
