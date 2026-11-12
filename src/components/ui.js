import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius, scale, scaledFont, spacing, type } from '../theme';

// Page wrapper: white background, consistent padding, optional large title.
// Use `safeTop` on screens without a navigation header (tabs, Language).
export function Screen({ title, subtitle, textScale = 1, safeTop = false, children, contentStyle }) {
  return (
    <SafeAreaView edges={safeTop ? ['top'] : []} style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, contentStyle]} keyboardShouldPersistTaps="handled">
        {title ? (
          <Text style={[type.title, { fontSize: scaledFont(28, textScale), lineHeight: scaledFont(34, textScale) }]} accessibilityRole="header">
            {title}
          </Text>
        ) : null}
        {subtitle ? <Text style={[type.muted, styles.subtitle]}>{subtitle}</Text> : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const cardTones = {
  default: { backgroundColor: colors.surface, borderColor: colors.border },
  blue: { backgroundColor: colors.blueSoft, borderColor: colors.blueSoft },
  green: { backgroundColor: colors.greenSoft, borderColor: colors.greenSoft },
  warning: { backgroundColor: colors.warningSoft, borderColor: colors.warningSoft },
  plain: { backgroundColor: colors.background, borderColor: colors.border }
};

export function Card({ tone = 'default', style, children, onPress, accessibilityLabel }) {
  const base = [styles.card, cardTones[tone], style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [...base, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

export function SectionTitle({ children, style }) {
  return (
    <Text style={[type.heading, styles.sectionTitle, style]} accessibilityRole="header">
      {children}
    </Text>
  );
}

const buttonVariants = {
  primary: { bg: colors.blue, fg: colors.onAccent, border: colors.blue },
  green: { bg: colors.green, fg: colors.onAccent, border: colors.green },
  secondary: { bg: colors.background, fg: colors.blueText, border: colors.borderStrong },
  quiet: { bg: 'transparent', fg: colors.blueText, border: 'transparent' }
};

export function Button({ label, onPress, variant = 'primary', icon, small = false, style, disabled }) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: v.bg, borderColor: v.border },
        (pressed || disabled) && styles.pressed,
        style
      ]}
    >
      {icon ? <Ionicons name={icon} size={scale(small ? 16 : 20)} color={v.fg} /> : null}
      <Text style={[styles.buttonText, small && styles.buttonTextSmall, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, tone = 'blue' }) {
  const accent = tone === 'green' ? colors.green : colors.blue;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: accent, borderColor: accent },
        pressed && styles.pressed
      ]}
    >
      {selected ? <Ionicons name="checkmark" size={scale(16)} color={colors.onAccent} /> : null}
      <Text style={[styles.chipText, selected && { color: colors.onAccent }]}>{label}</Text>
    </Pressable>
  );
}

export function Input({ style, ...props }) {
  return <TextInput placeholderTextColor={colors.placeholder} style={[styles.input, style]} {...props} />;
}

export function FieldLabel({ children }) {
  return <Text style={[type.label, styles.fieldLabel]}>{children}</Text>;
}

// A tappable row with a check circle: used for medication and meal checklists.
export function CheckRow({ label, checked, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!checked }}
      style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}
    >
      <Ionicons
        name={checked ? 'checkmark-circle' : 'ellipse-outline'}
        size={scale(26)}
        color={checked ? colors.green : colors.borderStrong}
      />
      <Text style={[type.body, styles.checkLabel, checked && styles.checkLabelDone]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2, gap: spacing.md },
  subtitle: { marginTop: -spacing.xs, marginBottom: spacing.xs },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg
  },
  sectionTitle: { marginTop: spacing.sm },
  pressed: { opacity: 0.7 },
  button: {
    minHeight: scale(52),
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm
  },
  buttonSmall: { minHeight: scale(40), paddingHorizontal: spacing.md, borderRadius: radius.sm },
  buttonText: { fontFamily: fonts.semibold, fontSize: scale(17) },
  buttonTextSmall: { fontSize: scale(15) },
  chip: {
    minHeight: scale(44),
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background
  },
  chipText: { fontFamily: fonts.medium, fontSize: scale(15), color: colors.text },
  input: {
    minHeight: scale(52),
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.regular,
    fontSize: scale(16),
    color: colors.text
  },
  fieldLabel: { marginBottom: -spacing.xs },
  checkRow: {
    minHeight: scale(48),
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs
  },
  checkLabel: { flex: 1 },
  checkLabelDone: { color: colors.textMuted, textDecorationLine: 'line-through' }
});
