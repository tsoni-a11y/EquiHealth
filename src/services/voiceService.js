import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  console.warn('Warning: ELEVENLABS_API_KEY is not set in environment variables');
}

const client = new ElevenLabsClient({
  apiKey: apiKey,
});

let sound = null;

// Text to Speech function
export const textToSpeech = async (text, voiceId = 'EXAVITQu4vr4xnSDxMaL') => {
  try {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured');
    }

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

// Speech to Text function - Convert audio file to text using ElevenLabs
export const speechToText = async (audioFilePath) => {
  try {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured');
    }

    // Read audio file as base64
    const audioBase64 = await FileSystem.readAsStringAsync(audioFilePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert to blob
    const audioBlob = base64ToBlob(audioBase64, 'audio/wav');

    // Use ElevenLabs speech-to-text API
    const response = await client.speechToText({
      audio: audioBlob,
    });

    return response.text || '';
  } catch (error) {
    console.error('Error converting speech to text:', error);
    throw error;
  }
};

// Helper function to convert base64 to blob
const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Get available voices
export const getAvailableVoices = async () => {
  try {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured');
    }

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
};
