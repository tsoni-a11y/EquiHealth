import React, { useState } from 'react';
import { Pressable, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Audio from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { speechToText } from '../services/voiceService';
import { scale } from '../theme';

export default function SpeechToTextButton({ onTextReceived, size = 24, color = '#0E9FBE' }) {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recorder, setRecorder] = useState(null);

  const startRecording = async () => {
    try {
      setIsLoading(true);

      // Request microphone permission
      const permission = await Audio.Recording.getPermissionsAsync();
      if (!permission.granted) {
        await Audio.Recording.requestPermissionsAsync();
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      setRecorder(recording);
      setIsListening(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsLoading(true);
      setIsListening(false);

      if (!recorder) return;

      await recorder.stopAndUnloadAsync();
      const uri = recorder.getURI();

      // Convert speech to text
      if (uri) {
        const text = await speechToText(uri);
        setTranscript(text);

        if (onTextReceived) {
          onTextReceived(text);
        }
      }

      setRecorder(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, isListening && styles.listening]}
        onPress={isListening ? stopRecording : startRecording}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Ionicons
            name={isListening ? 'mic' : 'mic-outline'}
            size={size}
            color={color}
          />
        )}
      </Pressable>
      {transcript ? (
        <Text style={styles.transcript}>{transcript}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: scale(8),
  },
  button: {
    padding: scale(8),
    borderRadius: scale(8),
  },
  listening: {
    backgroundColor: 'rgba(14, 159, 190, 0.2)',
  },
  transcript: {
    color: '#0E9FBE',
    fontSize: scale(12),
    textAlign: 'center',
    maxWidth: '80%',
  },
});
