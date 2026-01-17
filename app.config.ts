import { ConfigContext } from "expo/config";

export default ({ config }: ConfigContext) => ({
  ...config,
  expo: {
    name: "Chill Timer",
    slug: "chill-timer",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/1024x1024.png",
    scheme: "chill-timer",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/1024x1024.png",
      resizeMode: "contain",
      backgroundColor: "#0F2744",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.chill.timer",
      infoPlist: {
        NSHealthShareUsageDescription:
          "This app needs access to read your health data to track meditation sessions.",
        NSHealthUpdateUsageDescription:
          "This app needs access to write mindfulness session data to Apple Health.",
        UIBackgroundModes: ["audio"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/1024x1024.png",
        backgroundColor: "#0F2744",
      },
      package: "com.chill.timer",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "react-native-health",
        {
          healthSharePermission:
            "This app needs access to read your health data to track meditation sessions.",
          healthUpdatePermission:
            "This app needs access to write mindfulness session data to Apple Health.",
          isClinicalDataEnabled: false,
        },
      ],
      [
        "expo-audio",
        {
          microphonePermission: false,
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/1024x1024.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
});
