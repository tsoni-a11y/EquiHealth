import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const scale = (size) => Math.round(size * Math.min(width / BASE_WIDTH, height / BASE_HEIGHT));

export const scaledFont = (base, textScale = 1) => Math.round(scale(base) * textScale);

// Text colors meet WCAG AA (4.5:1) on white. `green` and `blue` are for fills and icons;
// use `greenText` / `blueText` when the accent color is used for text.
export const colors = {
  background: '#FFFFFF',
  surface: '#F4F7F9',
  border: '#E1E7EC',
  borderStrong: '#C9D3DB',

  text: '#14212B',
  textMuted: '#55636F',
  placeholder: '#8A96A1',

  blue: '#1E6BC6',
  blueText: '#1A5EAE',
  blueSoft: '#EAF2FB',

  green: '#2E9A5B',
  greenText: '#1E7A45',
  greenSoft: '#E8F6EE',

  warning: '#9A5B00',
  warningSoft: '#FFF5E2',

  onAccent: '#FFFFFF'
};

// Atkinson Hyperlegible Next: designed by the Braille Institute for low-vision readability.
// Devanagari (Hindi) glyphs fall back to the system font automatically.
export const fonts = {
  regular: 'AtkinsonHyperlegibleNext_400Regular',
  medium: 'AtkinsonHyperlegibleNext_500Medium',
  semibold: 'AtkinsonHyperlegibleNext_600SemiBold',
  bold: 'AtkinsonHyperlegibleNext_700Bold'
};

export const radius = {
  sm: scale(10),
  md: scale(14),
  lg: scale(18),
  pill: 999
};

export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24)
};

export const type = {
  title: { fontFamily: fonts.bold, fontSize: scale(28), lineHeight: scale(34), color: colors.text },
  heading: { fontFamily: fonts.semibold, fontSize: scale(19), lineHeight: scale(25), color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: scale(16), lineHeight: scale(23), color: colors.text },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: scale(16), lineHeight: scale(23), color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: scale(15), lineHeight: scale(21), color: colors.textMuted },
  label: { fontFamily: fonts.medium, fontSize: scale(14), lineHeight: scale(19), color: colors.textMuted }
};
