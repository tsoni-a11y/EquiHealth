import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_0cf772b9dc495a2ccd6f2dd8ae75192e03f47fbcf7820351';

const client = new ElevenLabsClient({
  apiKey: apiKey,
});

let sound = null;

// Text to Speech function
export const textToSpeech = async (text, voiceId = 'EXAVITQu4vr4xnSDxMaL') => {
  try {
    const audio = await client.generate({
      text: text,
      voice: voiceId,
      model_id: 'eleven_monolingual_v1',
    });

    return audio;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
};

// Play audio URL using Expo Audio
export const playAudioURL = async (audioUrl) => {
  try {
    // Stop any existing sound
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
    sound = newSound;
    await sound.playAsync();
  } catch (error) {
    console.error('Error playing audio:', error);
    throw error;
  }
};

// Get available voices
export const getAvailableVoices = async () => {
  try {
    const voices = await client.voices.getAll();
    return voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
};

// Stop audio playback
export const stopAudio = async () => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
  } catch (error) {
    console.error('Error stopping audio:', error);
  }
}