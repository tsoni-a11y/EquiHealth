# EquiHealth - Accessible Health Management App

A React Native Expo app for managing health conditions, medications, and wellness tracking with multi-language support and accessibility features.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed ([Download](https://nodejs.org/))
- iOS Simulator or Android Emulator (or physical device)

### Setup & Run

**Option 1: Automated Setup (Recommended)**
```bash
chmod +x setup.sh
./setup.sh
expo start --localhost
```
Then press `i` for iOS or `a` for Android.

**Option 2: Manual Setup**
```bash
npm install
npm install -g expo-cli
expo start --localhost
Press i
```

## 📋 Project Structure

```
├── App.js                 # Main app entry point
├── src/
│   ├── screens/          # App screens
│   ├── context/          # Global state (AppContext)
│   ├── i18n/             # Translations (EN, ES, FR, PT)
│   ├── services/         # Voice & auth services
│   ├── data/             # Static data (illness, medications)
│   └── theme.js          # Design system & scaling
├── setup.sh              # Automated setup script
└── package.json          # Dependencies
```

## ✨ Features

- 🌐 **Multi-language**: English, Spanish, French, Portuguese
- 🔊 **Accessibility**: Voice input/output support
- 💊 **Health Tracking**: Medications, meals, medical alerts
- 📊 **Disease Management**: Condition-specific information
- 📱 **Responsive Design**: Works on all device sizes
- 🎨 **Dark Theme**: Eye-friendly interface

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile
- **Expo** - Development & deployment
- **React Navigation** - Screen navigation
- **AsyncStorage** - Local data persistence
- **Expo Vector Icons** - UI icons

## 📱 Screens

- **Language Selection** - Choose preferred language
- **Authentication** - Login/signup
- **Profile Setup** - User information
- **Home** - Dashboard with reminders
- **Conditions** - Manage health conditions & medications
- **Diet Plans** - Track meals
- **Medical Alerts** - Set reminders
- **Settings** - App preferences

## 🔧 Troubleshooting

### App not loading?
```bash
expo start --clear
Press r
```

### Cache issues?
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Port already in use?
```bash
expo start --localhost --tunnel
```

## 📝 Development

### Add new screen:
1. Create file in `src/screens/`
2. Import in `App.js`
3. Add to navigation stack

### Add translations:
Edit `src/i18n/translations.js` and add keys

### Update theme:
Edit `src/theme.js` for colors and scaling

## 🤝 Contributing

1. Clone the repo
2. Run `./setup.sh`
3. Create a branch
4. Make changes
5. Test on simulator
6. Push & create PR

## 📄 License

MIT License - See LICENSE file

## 💡 Support

Having issues? Check the [troubleshooting section](#-troubleshooting) or open an issue on GitHub.
