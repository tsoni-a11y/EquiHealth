const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure web is not bundled with native code
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

// Add proper source extensions for native only (remove web)
config.resolver.sourceExts = ['ts', 'tsx', 'js', 'jsx', 'json', 'cjs', 'mjs'];

// Ensure we're not including web platform files
config.resolver.assetExts = [
  'gif', 'jpeg', 'jpg', 'png', 'psd', 'svg', 'webp',
  'm4a', 'aac', 'aiff', 'caf', 'mp3', 'wav', 'html', 'pdf'
];

module.exports = config;