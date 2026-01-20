import * as Notifications from "expo-notifications";

/**
 * Configure how notifications are handled when app is in foreground.
 * This MUST be called before any notifications are scheduled.
 */
export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
