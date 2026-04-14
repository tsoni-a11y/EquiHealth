import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const scale = (size) => Math.round(size * Math.min(width / BASE_WIDTH, height / BASE_HEIGHT));

export const scaledFont = (base, textScale = 1) => Math.round(scale(base) * textScale);

export const palette = {
  brandStart: '#0E9FBE',
  brandEnd: '#6CCB4F',
  textPrimary: '#F4FBFF',
  textMuted: '#B6C9D6',
  cardDark: '#152F3F',
  cardBlue: '#1E4055',
  cardGreen: '#214038',
  cardPurple: '#2F2946',
  borderSoft: '#2B4C5F'
};

export const gradients = {
  splash: ['#0A2A3A', '#103E2A'],
  home: ['#091A24', '#103129'],
  conditions: ['#1B1A35', '#12283F'],
  alerts: ['#281A2B', '#1C223D'],
  settings: ['#132838', '#173042']
};
