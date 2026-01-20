import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const TIMER_CHANNEL_ID = "timer-complete";
const CUSTOM_SOUND_FILENAME = "zen-gong.wav";

async function ensureNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(TIMER_CHANNEL_ID, {
    name: "Timer Complete",
    description: "Notifications when your meditation timer completes",
    importance: Notifications.AndroidImportance.MAX,
    sound: CUSTOM_SOUND_FILENAME,
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
  });
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();

  if (current.granted) {
    return true;
  }

  if (
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowSound: true,
      allowBadge: false,
    },
    android: {},
  });

  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function scheduleTimerNotification(
  durationSeconds: number,
): Promise<string | null> {
  if (durationSeconds <= 0) return null;

  const hasPermission = await ensureNotificationPermissions();
  if (!hasPermission) {
    console.warn("Notification permission not granted");
    return null;
  }

  await ensureNotificationChannel();

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Session Complete",
        body: "Your meditation timer has finished.",
        sound: CUSTOM_SOUND_FILENAME,
        ...(Platform.OS === "android" && {
          channelId: TIMER_CHANNEL_ID,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: durationSeconds,
        repeats: false,
      },
    });

    return notificationId;
  } catch (error) {
    console.error("Failed to schedule notification:", error);
    return null;
  }
}

export async function cancelTimerNotification(
  notificationId: string | null,
): Promise<void> {
  if (!notificationId) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Failed to cancel notification:", error);
  }
}
