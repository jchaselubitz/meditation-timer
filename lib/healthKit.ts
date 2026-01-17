import { Platform } from "react-native";
import type {
  HealthKitPermissions,
  HealthPermission,
} from "react-native-health";

import type { HealthKitInitResult } from "../types/healthKit";

let AppleHealthKit: any = null;
let healthKitPromise: Promise<any> | null = null;
let loadHealthKitErrorMessage: string | null = null;

function toErrorMessage(value: unknown): string {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

// Dynamically import HealthKit only on iOS
async function loadHealthKit(): Promise<void> {
  if (Platform.OS === "ios" && !healthKitPromise) {
    healthKitPromise = import("react-native-health")
      .then((module) => {
        AppleHealthKit = module.default;
      })
      .catch((error) => {
        loadHealthKitErrorMessage = toErrorMessage(error);
        console.warn("HealthKit not available:", loadHealthKitErrorMessage);
        AppleHealthKit = null;
      });
  }
  return healthKitPromise || Promise.resolve();
}

// Pre-load on module initialization
if (Platform.OS === "ios") {
  loadHealthKit();
}

const HEALTHKIT_PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: ["MindfulSession" as unknown as HealthPermission],
    write: ["MindfulSession" as unknown as HealthPermission],
  },
};

export async function initializeHealthKit(): Promise<HealthKitInitResult> {
  if (Platform.OS !== "ios") {
    return {
      connected: false,
      errorMessage: "Apple Health is only available on iOS.",
    };
  }

  await loadHealthKit();

  if (!AppleHealthKit) {
    const baseMessage =
      "Apple Health isn’t available in this build. Rebuild iOS with the `react-native-health` config plugin and ensure the HealthKit capability is enabled for your app identifier.";
    return {
      connected: false,
      errorMessage: loadHealthKitErrorMessage
        ? `${baseMessage}\n\nDetails: ${loadHealthKitErrorMessage}`
        : baseMessage,
    };
  }

  const isAvailable = await new Promise<boolean>((resolve) => {
    try {
      AppleHealthKit.isAvailable((error: unknown, available: boolean) => {
        if (error) {
          console.warn("HealthKit availability error:", error);
          resolve(false);
          return;
        }
        resolve(Boolean(available));
      });
    } catch (error) {
      console.warn("HealthKit availability threw:", error);
      resolve(false);
    }
  });

  if (!isAvailable) {
    return {
      connected: false,
      errorMessage:
        "Apple Health is not available on this device, or the app isn’t configured with the HealthKit entitlement.",
    };
  }

  return new Promise((resolve) => {
    try {
      AppleHealthKit.initHealthKit(
        HEALTHKIT_PERMISSIONS,
        (error: string | null) => {
          if (error) {
            console.warn("HealthKit initialization error:", error);
            resolve({
              connected: false,
              errorMessage:
                error ||
                "HealthKit initialization failed. You may need to enable permissions in the Apple Health app under Sources.",
            });
          } else {
            resolve({ connected: true });
          }
        },
      );
    } catch (error) {
      console.warn("HealthKit initialization threw:", error);
      resolve({
        connected: false,
        errorMessage: toErrorMessage(error),
      });
    }
  });
}

export async function saveMindfulSession(
  startDate: Date,
  endDate: Date,
): Promise<boolean> {
  if (Platform.OS !== "ios") {
    return false;
  }

  await loadHealthKit();

  if (!AppleHealthKit) {
    return false;
  }

  return new Promise((resolve) => {
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      AppleHealthKit.saveMindfulSession(
        options,
        (error: string | null, _result: any) => {
          if (error) {
            console.warn("Error saving mindful session:", error);
            resolve(false);
          } else {
            resolve(true);
          }
        },
      );
    } catch (error) {
      console.warn("Error saving mindful session threw:", error);
      resolve(false);
    }
  });
}

export async function isHealthKitAvailable(): Promise<boolean> {
  if (Platform.OS !== "ios") {
    return false;
  }

  await loadHealthKit();
  return AppleHealthKit !== null;
}
