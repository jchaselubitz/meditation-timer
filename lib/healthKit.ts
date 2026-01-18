import { Platform } from "react-native";

import type { HealthKitInitResult } from "../types/healthKit";

// Only import on iOS to avoid errors on other platforms
let healthKit: typeof import("@kingstinct/react-native-healthkit") | null =
  null;

if (Platform.OS === "ios") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    healthKit = require("@kingstinct/react-native-healthkit");
  } catch (error) {
    console.warn("Failed to load HealthKit:", error);
  }
}

export function isHealthKitAvailable(): boolean {
  if (Platform.OS !== "ios" || !healthKit) {
    return false;
  }

  try {
    return healthKit.isHealthDataAvailable();
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

  if (!healthKit) {
    return {
      connected: false,
      errorMessage:
        "Apple Health isn't available in this build. Rebuild iOS with the HealthKit config plugin.",
    };
  }

  try {
    const isAvailable = healthKit.isHealthDataAvailable();
    if (!isAvailable) {
      return {
        connected: false,
        errorMessage:
          "Apple Health is not available on this device. HealthKit requires an iPhone.",
      };
    }

    await healthKit.requestAuthorization({
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
  if (Platform.OS !== "ios" || !healthKit) {
    return false;
  }

  try {
    await healthKit.saveCategorySample(
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
