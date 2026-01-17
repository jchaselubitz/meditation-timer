import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

let gongSound: Sound | null = null;
let soundLoaded = false;

// Meditation bell sound URI - using a royalty-free sound
// You can replace this with your own gong.mp3 in the assets folder
const GONG_SOUND_URI = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export async function loadGongSound(): Promise<void> {
  if (soundLoaded) return;

  try {
    // Configure audio mode for playback even in silent mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    // Load from URI (using a reliable meditation bell sound)
    const { sound } = await Audio.Sound.createAsync(
      { uri: GONG_SOUND_URI },
      { shouldPlay: false }
    );
    gongSound = sound;
    soundLoaded = true;
  } catch (error) {
    console.log('Error loading gong sound:', error);
  }
}

export async function playGong(volume: number = 1.0): Promise<void> {
  if (!gongSound) {
    await loadGongSound();
  }

  if (gongSound) {
    try {
      await gongSound.setVolumeAsync(volume);
      await gongSound.setPositionAsync(0);
      await gongSound.playAsync();
    } catch (error) {
      console.log('Error playing gong:', error);
    }
  }
}

export async function previewGong(volume: number): Promise<void> {
  await playGong(volume);
}

export async function unloadGongSound(): Promise<void> {
  if (gongSound) {
    await gongSound.unloadAsync();
    gongSound = null;
    soundLoaded = false;
  }
}
