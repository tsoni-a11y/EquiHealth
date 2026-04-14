import React, { useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { illnessData, illnessOptions } from '../data/illnessData';
import { t } from '../i18n/translations';
import { gradients, scale, scaledFont } from '../theme';

export default function SettingsScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const { language, selectedIllnesses, user, textScale, updateSettings } = useApp();
  const [langChoice, setLangChoice] = useState(language);
  const [illnessChoices, setIllnessChoices] = useState(selectedIllnesses);
  const [scaleChoice, setScaleChoice] = useState(textScale || 1);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'settingsTitle') });
  }, [navigation, language]);

  const toggleChoice = (illnessKey) => {
    if (illnessChoices.includes(illnessKey)) {
      if (illnessChoices.length === 1) return;
      setIllnessChoices(illnessChoices.filter((i) => i !== illnessKey));
      return;
    }
    setIllnessChoices([...illnessChoices, illnessKey]);
  };

  const onSave = async () => {
    await updateSettings({
      lang: langChoice,
      illnessKeys: illnessChoices,
      textScaleValue: scaleChoice
    });
    Alert.alert(t(langChoice, 'settingsSaved'));
  };

  return (
    <LinearGradient colors={gradients.settings} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + scale(24) }]}>
          <View style={styles.card}>
            <Text style={styles.section}>{t(langChoice, 'profile')}</Text>
            <Text style={styles.profileLine}>{user?.name || '-'}</Text>
            <Text style={styles.profileLine}>{user?.phone || '-'}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>{t(langChoice, 'languageSetting')}</Text>
            <View style={styles.rowWrap}>
              <Pressable style={[styles.chip, langChoice === 'en' && styles.chipSelected]} onPress={() => setLangChoice('en')}>
                <Text style={styles.chipText}>{t('en', 'english')}</Text>
              </Pressable>
              <Pressable style={[styles.chip, langChoice === 'hi' && styles.chipSelected]} onPress={() => setLangChoice('hi')}>
                <Text style={styles.chipText}>{t('hi', 'hindi')}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>{t(langChoice, 'illnessSetting')}</Text>
            <View style={styles.rowWrap}>
              {illnessOptions.map((key) => (
                <Pressable key={key} style={[styles.chip, illnessChoices.includes(key) && styles.chipSelected]} onPress={() => toggleChoice(key)}>
                  <Text style={styles.chipText}>{illnessData[key].labels[langChoice]}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>{t(langChoice, 'accessibility')}</Text>
            <Text style={styles.rowLabel}>{t(langChoice, 'textSize')}: {scaleChoice.toFixed(2)}x</Text>
            <Slider
              minimumValue={0.9}
              maximumValue={1.4}
              step={0.05}
              value={scaleChoice}
              minimumTrackTintColor="#0E9FBE"
              maximumTrackTintColor="#4A6470"
              thumbTintColor="#6CCB4F"
              onValueChange={setScaleChoice}
            />
            <Text style={[styles.preview, { fontSize: scaledFont(14, scaleChoice) }]}>Sample preview text</Text>
            <View style={styles.rowLine}>
              <Text style={styles.rowLabel}>{t(langChoice, 'voiceAssist')}</Text>
              <Switch value={false} disabled onValueChange={() => {}} />
            </View>
            <Text style={styles.note}>{t(langChoice, 'voiceComingSoon')}</Text>
          </View>

          <Pressable style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveText}>{t(langChoice, 'saveSettings')}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: scale(16), paddingBottom: scale(30) },
  card: {
    backgroundColor: '#132A36',
    borderRadius: scale(14),
    padding: scale(14),
    marginBottom: scale(12),
    borderWidth: 1,
    borderColor: '#2B4C5F'
  },
  section: { fontSize: scale(17), fontWeight: '800', color: '#EAF8FF', marginBottom: scale(8) },
  profileLine: { color: '#B7D5DF', marginBottom: scale(4) },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#1A4255',
    borderRadius: scale(18),
    borderColor: '#2B4C5F',
    borderWidth: 1,
    paddingVertical: scale(9),
    paddingHorizontal: scale(14)
  },
  chipSelected: { backgroundColor: '#205A44', borderColor: '#6CCB4F' },
  chipText: { color: '#EAF8FF', fontWeight: '700' },
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(4)
  },
  rowLabel: { color: '#DDEFF5', fontWeight: '700' },
  preview: { color: '#BFD0E0', marginTop: scale(6) },
  note: { marginTop: scale(8), color: '#A7C1CC', fontSize: scale(12) },
  saveButton: {
    marginTop: scale(4),
    backgroundColor: '#0e9fbe',
    borderRadius: scale(12),
    alignItems: 'center',
    paddingVertical: scale(12)
  },
  saveText: { color: '#fff', fontSize: scale(16), fontWeight: '800' }
});
