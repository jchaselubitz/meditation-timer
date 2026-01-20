import { ConfigContext } from "expo/config";

export default ({ config }: ConfigContext) => ({
  ...config,
  expo: {
    name: "Chill Timer",
    slug: "chill-timer",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/1024x1024.png",
    scheme: "chill-timer",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/1024x1024.png",
      resizeMode: "contain",
      backgroundColor: "#0F2744",
    },
    ios: {
      icon: "./assets/images/1024x1024.png",
      supportsTablet: true,
      bundleIdentifier: "com.chill.timer",
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
        "expo-notifications",
        {
          sounds: ["./assets/sounds/zen-gong.wav"],
        },
      ],
      [
        "@kingstinct/react-native-healthkit",
        {
          NSHealthShareUsageDescription:
            "This app does not read your health data. It only writes mindfulness session data to Apple Health.",
          NSHealthUpdateUsageDescription:
            "This app needs access to write mindfulness session data to Apple Health.",
          background: false,
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
