import React, { useState } from 'react';
import { Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { textToSpeech, playAudioURL, stopAudio } from '../services/voiceService';
import { scale } from '../theme';

export default function VoiceButton({ text, size = 24, color = '#0E9FBE' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    try {
      if (isPlaying) {
        await stopAudio();
        setIsPlaying(false);
        return;
      }

      setIsLoading(true);
      const audio = await textToSpeech(text);
      
      if (audio) {
        setIsPlaying(true);
        await playAudioURL(audio.url || audio);
        // Reset after audio finishes (approximately)
        setTimeout(() => {
          setIsPlaying(false);
        }, text.length * 50); // Rough estimate
      }
    } catch (error) {
      console.error('Error in voice button:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      style={[styles.button, isPlaying && styles.playing]}
      onPress={handleSpeak}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons
          name={isPlaying ? 'pause-circle' : 'volume-high'}
          size={size}
          color={color}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: scale(8),
  },
  playing: {
    opacity: 0.7,
  },
});