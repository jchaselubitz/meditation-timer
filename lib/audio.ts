import { Asset } from "expo-asset";
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from "expo-audio";

let gongPlayer: AudioPlayer | null = null;
let soundLoaded = false;

// Meditation bell sound module - using a royalty-free sound
// You can replace this with your own gong.mp3 in the assets folder
import GONG_SOUND_MODULE from "../assets/sounds/zen-gong.mp3";

export async function loadGongSound(): Promise<void> {
  if (soundLoaded) return;

  try {
    // Configure audio mode for playback even in silent mode
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
    });

    // Convert require() result to URI using Asset.fromModule
    const asset = Asset.fromModule(GONG_SOUND_MODULE);
    await asset.downloadAsync();

    // Create audio player with URI source
    gongPlayer = createAudioPlayer({ uri: asset.localUri || asset.uri });
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
