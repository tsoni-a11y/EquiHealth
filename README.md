# EquiHealth Mobile App

This repository now includes an Expo React Native app that can run on iOS in development mode.

## Implemented Features

1. Language-first startup screen with English and Hindi selection.
2. All app labels and major content switch based on selected language.
3. Conditions and medications flow with illness-based auto-population.
4. Diet plans auto-populate based on selected illness.
5. Medication reminder scheduling with local notifications.
6. Logs and tracking buttons redirect to one complete "All Logs" screen.
7. Family access and exercise flows are removed from app navigation.
8. Hypertension disease content is preloaded from your provided information, with exercise references removed.
9. Signup + profile/accessibility setup are persistent across launches.
10. Reminder time is selected using a native time picker.

## iOS Dev Mode Run Steps

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npm start
```

3. On your iPhone, install **Expo Go** from the App Store.
4. Scan the QR code from the terminal/browser.
5. Allow notification permission in the app to receive medication reminders.

## Xcode + Connected iPhone Dev Mode

1. Generate native iOS project files:

```bash
npm run prebuild:ios
```

2. Install CocoaPods (if needed) and sync pods:

```bash
cd ios && pod install && cd ..
```

3. Open workspace in Xcode:

```bash
open ios/EquiHealth.xcworkspace
```

4. In Xcode:
- Select your connected iPhone as run target.
- Set a valid `Team` under **Signing & Capabilities** for the app target.
- Use a unique bundle id if Xcode asks.

5. Start Metro in terminal:

```bash
npm start
```

6. Press Run in Xcode to install and launch on your device.

Alternative one-command device run:

```bash
npm run run:ios:device
```

## Project Structure

- `App.js`: Navigation and app entry.
- `src/context/AppContext.js`: Global state, persistence, logs, and notification reminder logic.
- `src/data/illnessData.js`: Illness-specific medications, diet, and disease info.
- `src/i18n/translations.js`: English and Hindi text resources.
- `src/screens/*.js`: App screens.
- `screens/*.svg`: Original design mockups.
