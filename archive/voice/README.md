# Archived: voice input/output (ElevenLabs)

These files are parked here, outside `src/`, so they are not bundled. No screen used them.

They will not build on Expo SDK 58 as-is. To bring the feature back:

- Replace `expo-av` (removed from the Expo SDK) with `expo-audio` for recording and playback.
  `SpeechToTextButton.js` also used `import * as Audio from 'expo-av'` and then `Audio.Recording`,
  which was wrong even on older SDKs.
- Install `expo-file-system` and update `readAsStringAsync` / `EncodingType` to its current API
  (or import from `expo-file-system/legacy`).
- Install `@elevenlabs/elevenlabs-js` and check the `speechToText` / `textToSpeech` calls against its current API.
- Expo only exposes env vars prefixed with `EXPO_PUBLIC_`, and anything exposed that way can be read
  out of the app bundle. Call ElevenLabs through a small backend (for example a Supabase Edge Function)
  instead of putting the API key in the app.
