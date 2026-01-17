# Meditation Timer

A simple, elegant meditation timer app for iOS with Apple Health integration.

## Features

- Set meditation duration (1-180 minutes)
- Adjustable gong volume for end of meditation
- Timer continues counting after goal is reached
- Save mindfulness sessions to Apple Health
- Clean, minimalist dark UI
- Screen stays awake during meditation

## Getting Started

```bash
# Install dependencies
yarn install

# Start development
yarn start:expo

# Run on iOS simulator
yarn ios

# Run on physical iOS device
yarn ios --device
```

## Apple Health Integration

The app will request permission to write Mindfulness sessions to Apple Health. This allows you to:

- Track your meditation practice over time
- See meditation data in the Health app
- Integrate with other mindfulness tracking

## Customization

### Gong Sound

The app uses a remote meditation bell sound. To use your own:

1. Add your `gong.mp3` to the `assets/` folder
2. Update `lib/audio.ts` to use the local file:
   ```ts
   gongPlayer = createAudioPlayer(require('../assets/gong.mp3'));
   ```

### App Icons

Add your app icons to the `assets/` folder:
- `icon.png` - 1024x1024 app icon
- `splash-icon.png` - splash screen icon
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon

## Building for Production

```bash
# Build for iOS
npx expo build:ios

# Or use EAS Build
npx eas build --platform ios
```

## Tech Stack

- React Native with Expo SDK 54
- Expo Router for navigation
- expo-audio for audio playback
- react-native-health for Apple Health
- TypeScript for type safety
