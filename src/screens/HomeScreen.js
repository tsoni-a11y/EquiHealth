import React, { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { illnessData } from '../data/illnessData';
import { t } from '../i18n/translations';
import { gradients, palette, scale, scaledFont } from '../theme';

function ChecklistRow({ checked, label, onPress }) {
  return (
    <Pressable style={styles.checkRow} onPress={onPress}>
      <Ionicons name={checked ? 'checkmark-circle' : 'ellipse-outline'} size={scale(20)} color={checked ? '#6CCB4F' : '#A7C1CC'} />
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
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
  const nextReminderLabel = nextReminder
    ? `${t(language, nextReminder.label) !== nextReminder.label ? t(language, nextReminder.label) : (nextReminder.label || nextReminder.medName)} - ${String(nextReminder.hour).padStart(2, '0')}:${String(nextReminder.minute).padStart(2, '0')}`
    : t(language, 'none');
  const mealsDone = ['breakfast', 'lunch', 'dinner'].filter((k) => !!mealChecklist[k]).length;

  return (
    <LinearGradient colors={gradients.home} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + scale(28) }]}>
          <Text style={[styles.heading, { fontSize: scaledFont(30, textScale) }]}>
            {t(language, 'welcome')}
            {user?.name ? `, ${user.name}` : ''}
          </Text>
          <Text style={[styles.subHeading, { fontSize: scaledFont(13, textScale) }]}>{t(language, 'homeSubtitle')}</Text>

          <LinearGradient colors={[palette.brandStart, palette.brandEnd]} style={styles.banner}>
            <Text style={styles.bannerLabel}>{t(language, 'nextReminder')}</Text>
            <Text style={styles.bannerValue}>{nextReminderLabel}</Text>
            <Text style={styles.bannerSub}>{t(language, 'selectedIllness')}: {illnessLabel}</Text>
          </LinearGradient>

          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: '#153242' }]}>
              <Text style={styles.metricLabel}>{t(language, 'medicationCounter')}</Text>
              <Text style={styles.metricValue}>{medicationTaken}/{medicationTotal || meds.length || 0}</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#1A3F33' }]}>
              <Text style={styles.metricLabel}>{t(language, 'mealsTracker')}</Text>
              <Text style={styles.metricSmall}>{mealsDone}/3</Text>
            </View>
          </View>

          <Text style={styles.sectionHeading}>Quick Actions</Text>
          <View style={styles.quickRow}>
            <Pressable style={[styles.quickCard, { backgroundColor: '#1A4255' }]} onPress={() => navigation.navigate('DietPlans')}>
              <Text style={styles.quickTitle}>{t(language, 'dietPlans')}</Text>
            </Pressable>
            <Pressable style={[styles.quickCard, { backgroundColor: '#205A44' }]} onPress={() => navigation.navigate('MedicalAlerts')}>
              <Text style={styles.quickTitle}>{t(language, 'medicalAlerts')}</Text>
            </Pressable>
            <Pressable style={[styles.quickCard, { backgroundColor: '#223D66' }]} onPress={() => navigation.navigate('DiseaseInfo')}>
              <Text style={styles.quickTitle}>{t(language, 'diseaseInfo')}</Text>
            </Pressable>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>{t(language, 'scheduleSummary')}</Text>
            {meds.map((med) => (
              <ChecklistRow
                key={med}
                checked={!!medicationChecklist[med]}
                label={med}
                onPress={() => toggleMedicationTaken(med)}
              />
            ))}

            <Text style={styles.subTracker}>{t(language, 'mealsTracker')}</Text>
            <ChecklistRow checked={!!mealChecklist.breakfast} label={t(language, 'breakfast')} onPress={() => toggleMealTaken('breakfast')} />
            <ChecklistRow checked={!!mealChecklist.lunch} label={t(language, 'lunch')} onPress={() => toggleMealTaken('lunch')} />
            <ChecklistRow checked={!!mealChecklist.dinner} label={t(language, 'dinner')} onPress={() => toggleMealTaken('dinner')} />
          </View>

          <View style={styles.logsBox}>
            <Text style={styles.logsTitle}>{t(language, 'logsAndTracking')}</Text>
            <Pressable style={styles.logButton} onPress={() => navigation.navigate('AllLogs')}>
              <Text style={styles.logText}>{t(language, 'viewAllLogs')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: scale(16), gap: scale(10) },
  heading: { fontWeight: '800', color: palette.textPrimary },
  subHeading: { color: '#AEC9D3', marginBottom: scale(8) },
  banner: {
    borderRadius: scale(18),
    padding: scale(16),
    marginBottom: scale(6)
  },
  bannerLabel: { color: '#EAF8FF', fontSize: scale(12), fontWeight: '700' },
  bannerValue: { marginTop: scale(6), fontWeight: '800', color: '#FFFFFF', fontSize: scale(18) },
  bannerSub: { marginTop: scale(4), color: '#EAF8FF', fontSize: scale(12) },
  metricsRow: { flexDirection: 'row', gap: scale(10) },
  metricCard: {
    flex: 1,
    minHeight: scale(100),
    borderRadius: scale(16),
    padding: scale(12),
    justifyContent: 'center'
  },
  metricLabel: { color: '#DDEFF5', fontWeight: '700' },
  metricValue: { color: '#0E9FBE', fontSize: scale(30), fontWeight: '800', marginTop: scale(6) },
  metricSmall: { color: '#ECFAF1', fontSize: scale(22), fontWeight: '700', marginTop: scale(6) },
  sectionHeading: { color: '#F4FBFF', fontSize: scale(18), fontWeight: '800', marginTop: scale(6) },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(8)
  },
  quickCard: {
    flex: 1,
    minHeight: scale(110),
    borderRadius: scale(14),
    padding: scale(10),
    justifyContent: 'center'
  },
  quickTitle: { color: '#EAF8FF', fontSize: scale(14), fontWeight: '700' },
  summaryBox: {
    marginTop: scale(6),
    backgroundColor: '#102632',
    borderRadius: scale(16),
    padding: scale(14)
  },
  summaryTitle: { fontSize: scale(16), fontWeight: '800', color: '#EAF8FF', marginBottom: scale(8) },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: scale(6)
  },
  checkLabel: { color: '#C9EAF3', fontSize: scale(14), flex: 1 },
  subTracker: { marginTop: scale(8), color: '#EAF8FF', fontWeight: '800', fontSize: scale(14) },
  logsBox: {
    marginTop: scale(8),
    backgroundColor: '#102632',
    borderRadius: scale(16),
    padding: scale(14)
  },
  logsTitle: { fontSize: scale(16), fontWeight: '800', color: '#EAF8FF', marginBottom: scale(8) },
  logButton: {
    backgroundColor: '#1A4255',
    borderWidth: 1,
    borderColor: '#2B4C5F',
    borderRadius: scale(12),
    padding: scale(12)
  },
  logText: { color: '#DDEFF5', fontWeight: '600' }
});
