import { Platform } from 'react-native';

// HealthKit types for mindfulness
type HealthKitPermissions = {
  permissions: {
    read: string[];
    write: string[];
  };
};

let AppleHealthKit: any = null;

// Dynamically import HealthKit only on iOS
if (Platform.OS === 'ios') {
  try {
    AppleHealthKit = require('react-native-health').default;
  } catch (e) {
    console.log('HealthKit not available');
  }
}

const HEALTHKIT_PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: ['MindfulSession'],
    write: ['MindfulSession'],
  },
};

export async function initializeHealthKit(): Promise<boolean> {
  if (Platform.OS !== 'ios' || !AppleHealthKit) {
    console.log('HealthKit is only available on iOS');
    return false;
  }

  return new Promise((resolve) => {
    AppleHealthKit.initHealthKit(HEALTHKIT_PERMISSIONS, (error: string | null) => {
      if (error) {
        console.log('HealthKit initialization error:', error);
        resolve(false);
      } else {
        console.log('HealthKit initialized successfully');
        resolve(true);
      }
    });
  });
}

export async function saveMindfulSession(
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  if (Platform.OS !== 'ios' || !AppleHealthKit) {
    console.log('HealthKit is only available on iOS');
    return false;
  }

  return new Promise((resolve) => {
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    AppleHealthKit.saveMindfulSession(options, (error: string | null, result: any) => {
      if (error) {
        console.log('Error saving mindful session:', error);
        resolve(false);
      } else {
        console.log('Mindful session saved:', result);
        resolve(true);
      }
    });
  });
}

export function isHealthKitAvailable(): boolean {
  return Platform.OS === 'ios' && AppleHealthKit !== null;
}
