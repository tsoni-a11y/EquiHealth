import React, { useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { illnessData } from '../data/illnessData';
import { t } from '../i18n/translations';
import { colors, fonts, radius, scale, spacing, type } from '../theme';
import { Card, CheckRow, Screen, SectionTitle } from '../components/ui';

function QuickAction({ icon, label, tint, bg, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.quickIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={scale(22)} color={tint} />
      </View>
      <Text style={styles.quickTitle} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
}

function Stat({ label, value, total, color, bg }) {
  return (
    <View style={[styles.stat, { backgroundColor: bg }]}>
      <Text style={type.label}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>
        {value}
        <Text style={styles.statTotal}> / {total}</Text>
      </Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const {
    language,
    primaryIllness,
    user,
    textScale,
    nextReminder,
    selectedMedications,
    medicationCatalog,
    getCombinedMedications,
    medicationChecklist,
    mealChecklist,
    toggleMedicationTaken,
    toggleMealTaken,
    medicationTaken,
    medicationTotal
  } = useApp();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'appName') });
  }, [navigation, language]);

  const meds = selectedMedications.length ? selectedMedications : (medicationCatalog.length ? medicationCatalog : getCombinedMedications(language));
  const illnessLabel = illnessData[primaryIllness]?.labels?.[language] || primaryIllness;
  const nextReminderName = nextReminder
    ? (t(language, nextReminder.label) !== nextReminder.label ? t(language, nextReminder.label) : (nextReminder.label || nextReminder.medName))
    : null;
  const nextReminderTime = nextReminder
    ? `${String(nextReminder.hour).padStart(2, '0')}:${String(nextReminder.minute).padStart(2, '0')}`
    : null;
  const mealsDone = ['breakfast', 'lunch', 'dinner'].filter((k) => !!mealChecklist[k]).length;

  return (
    <Screen
      safeTop
      textScale={textScale}
      title={`${t(language, 'welcome')}${user?.name ? `, ${user.name}` : ''}`}
      subtitle={t(language, 'homeSubtitle')}
    >
      <Card tone="blue" onPress={() => navigation.navigate('MedicalAlerts')} accessibilityLabel={t(language, 'nextReminder')}>
        <View style={styles.reminderRow}>
          <View style={styles.reminderIcon}>
            <Ionicons name="alarm-outline" size={scale(24)} color={colors.onAccent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.label, { color: colors.blueText }]}>{t(language, 'nextReminder')}</Text>
            <Text style={styles.reminderValue}>
              {nextReminderName ? `${nextReminderName} · ${nextReminderTime}` : t(language, 'none')}
            </Text>
            <Text style={type.muted}>{t(language, 'selectedIllness')}: {illnessLabel}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.statsRow}>
        <Stat
          label={t(language, 'medicationCounter')}
          value={medicationTaken}
          total={medicationTotal || meds.length || 0}
          color={colors.blueText}
          bg={colors.surface}
        />
        <Stat label={t(language, 'mealsTracker')} value={mealsDone} total={3} color={colors.greenText} bg={colors.surface} />
      </View>

      <SectionTitle>{t(language, 'quickActions')}</SectionTitle>
      <View style={styles.quickRow}>
        <QuickAction icon="nutrition-outline" label={t(language, 'dietPlans')} tint={colors.greenText} bg={colors.greenSoft} onPress={() => navigation.navigate('DietPlans')} />
        <QuickAction icon="notifications-outline" label={t(language, 'medicalAlerts')} tint={colors.blueText} bg={colors.blueSoft} onPress={() => navigation.navigate('MedicalAlerts')} />
        <QuickAction icon="book-outline" label={t(language, 'diseaseInfo')} tint={colors.greenText} bg={colors.greenSoft} onPress={() => navigation.navigate('DiseaseInfo')} />
      </View>

      <SectionTitle>{t(language, 'scheduleSummary')}</SectionTitle>
      <Card tone="plain" style={styles.listCard}>
        {meds.map((med) => (
          <CheckRow key={med} label={med} checked={!!medicationChecklist[med]} onPress={() => toggleMedicationTaken(med)} />
        ))}
      </Card>

      <SectionTitle>{t(language, 'mealsTracker')}</SectionTitle>
      <Card tone="plain" style={styles.listCard}>
        {['breakfast', 'lunch', 'dinner'].map((meal) => (
          <CheckRow key={meal} label={t(language, meal)} checked={!!mealChecklist[meal]} onPress={() => toggleMealTaken(meal)} />
        ))}
      </Card>

      <Card onPress={() => navigation.navigate('AllLogs')} accessibilityLabel={t(language, 'viewAllLogs')} style={styles.logsCard}>
        <Ionicons name="stats-chart-outline" size={scale(22)} color={colors.blueText} />
        <View style={{ flex: 1 }}>
          <Text style={type.bodyStrong}>{t(language, 'logsAndTracking')}</Text>
          <Text style={type.muted}>{t(language, 'viewAllLogs')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={scale(20)} color={colors.textMuted} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  reminderIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: radius.md,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reminderValue: { fontFamily: fonts.semibold, fontSize: scale(19), lineHeight: scale(25), color: colors.text, marginVertical: 2 },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs },
  statValue: { fontFamily: fonts.bold, fontSize: scale(30), lineHeight: scale(36) },
  statTotal: { fontFamily: fonts.medium, fontSize: scale(18), color: colors.textMuted },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quickCard: {
    flex: 1,
    minHeight: scale(104),
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.sm
  },
  quickIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickTitle: { fontFamily: fonts.semibold, fontSize: scale(14), lineHeight: scale(18), color: colors.text },
  listCard: { paddingVertical: spacing.sm },
  logsCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm }
});
