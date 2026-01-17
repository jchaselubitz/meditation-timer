import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from "expo-audio";

let gongPlayer: AudioPlayer | null = null;
let soundLoaded = false;

// Meditation bell sound URI - using a royalty-free sound
// You can replace this with your own gong.mp3 in the assets folder
const GONG_SOUND_URI =
  "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export async function loadGongSound(): Promise<void> {
  if (soundLoaded) return;

  try {
    // Configure audio mode for playback even in silent mode
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
    });

    // Create audio player with URI source
    gongPlayer = createAudioPlayer({ uri: GONG_SOUND_URI });
    soundLoaded = true;
  } catch (error) {
    console.log("Error loading gong sound:", error);
  }
}

export async function playGong(volume: number = 1.0): Promise<void> {
  if (!gongPlayer) {
    await loadGongSound();
  }

  if (gongPlayer) {
    try {
      gongPlayer.volume = volume;
      gongPlayer.seekTo(0);
      gongPlayer.play();
    } catch (error) {
      console.log("Error playing gong:", error);
    }
  }
}

export async function previewGong(volume: number): Promise<void> {
  await playGong(volume);
}

export async function unloadGongSound(): Promise<void> {
  if (gongPlayer) {
    gongPlayer.release();
    gongPlayer = null;
    soundLoaded = false;
  }
}
