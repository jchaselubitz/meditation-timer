import { Platform } from "react-native";

import type { HealthKitInitResult } from "../types/healthKit";

type HealthKitModule = typeof import("@kingstinct/react-native-healthkit");

let healthKit: HealthKitModule | null = null;
let didAttemptLoadHealthKit = false;

async function getHealthKit(): Promise<HealthKitModule | null> {
  if (Platform.OS !== "ios") {
    return null;
  }

  if (healthKit) {
    return healthKit;
  }

  if (didAttemptLoadHealthKit) {
    return null;
  }

  didAttemptLoadHealthKit = true;
  try {
    healthKit = await import("@kingstinct/react-native-healthkit");
    return healthKit;
  } catch (error) {
    console.warn("Failed to load HealthKit:", error);
    return null;
  }
}

export async function isHealthKitAvailable(): Promise<boolean> {
  const hk = await getHealthKit();
  if (Platform.OS !== "ios" || !hk) {
    return false;
  }

  try {
    return hk.isHealthDataAvailable();
  } catch (error) {
    console.warn("HealthKit availability check failed:", error);
    return false;
  }
}

export async function initializeHealthKit(): Promise<HealthKitInitResult> {
  if (Platform.OS !== "ios") {
    return {
      connected: false,
      errorMessage: "Apple Health is only available on iOS.",
    };
  }

  const hk = await getHealthKit();
  if (!hk) {
    return {
      connected: false,
      errorMessage:
        "Apple Health isn't available in this build. Rebuild iOS with the HealthKit config plugin.",
    };
  }

  try {
    const isAvailable = hk.isHealthDataAvailable();
    if (!isAvailable) {
      return {
        connected: false,
        errorMessage:
          "Apple Health is not available on this device. HealthKit requires an iPhone.",
      };
    }

    await hk.requestAuthorization({
      toShare: ["HKCategoryTypeIdentifierMindfulSession"],
    });

    return { connected: true };
  } catch (error) {
    console.warn("HealthKit initialization error:", error);
    return {
      connected: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : "HealthKit initialization failed. You may need to enable permissions in the Health app under Sources.",
    };
  }
}

export async function saveMindfulSession(
  startDate: Date,
  endDate: Date,
): Promise<boolean> {
  const hk = await getHealthKit();
  if (Platform.OS !== "ios" || !hk) {
    return false;
  }

  try {
    await hk.saveCategorySample(
      "HKCategoryTypeIdentifierMindfulSession",
      0, // No specific value needed for mindful sessions
      startDate,
      endDate,
    );
    return true;
  } catch (error) {
    console.warn("Error saving mindful session:", error);
    return false;
  }
}
