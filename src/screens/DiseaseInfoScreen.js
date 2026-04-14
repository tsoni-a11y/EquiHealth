import React, { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { illnessData } from '../data/illnessData';
import { t } from '../i18n/translations';
import { scale, scaledFont } from '../theme';

export default function DiseaseInfoScreen({ navigation }) {
  const { language, textScale, primaryIllness, selectedIllnesses, setPrimaryIllness, getInfoCard, saveLanguage } = useApp();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'diseaseInfo') });
  }, [navigation, language]);

  const info = getInfoCard(language);

  return (
    <LinearGradient colors={['#1C2638', '#173525']} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { fontSize: scaledFont(30, textScale) }]}>{t(language, 'diseaseInfo')}</Text>
          <Text style={styles.subtitle}>Short and clear health education</Text>

          <View style={styles.chipsRow}>
            {selectedIllnesses.map((key) => {
              const selected = primaryIllness === key;
              return (
                <Pressable
                  key={key}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setPrimaryIllness(key)}
                >
                  <Text style={styles.chipText}>{illnessData[key].labels[language]}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.card, { backgroundColor: '#27344B' }]}>
            <Text style={styles.cardTitle}>{info?.whatIsTitle}</Text>
            {(info?.whatIsLines || []).map((line) => (
              <Text key={line} style={styles.cardText}>{line}</Text>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: '#214538' }]}>
            <Text style={styles.cardTitle}>{info?.medicationTitle}</Text>
            {(info?.medicationLines || []).map((line) => (
              <Text key={line} style={styles.cardText}>{line}</Text>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: '#4E3A1F' }]}>
            <Text style={styles.cardTitle}>{info?.warningTitle}</Text>
            {(info?.warningLines || []).map((line) => (
              <Text key={line} style={styles.cardText}>{line}</Text>
            ))}
          </View>

          <Pressable style={styles.cta} onPress={() => saveLanguage('hi')}>
            <Text style={styles.ctaText}>{t(language, 'readInHindi')}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: scale(16), paddingBottom: scale(20) },
  title: { color: '#F3FFF8', fontWeight: '800' },
  subtitle: { color: '#C9E5D8', marginTop: scale(6), marginBottom: scale(10) },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(8), marginBottom: scale(10) },
  chip: {
    backgroundColor: '#2B3B55',
    borderRadius: scale(18),
    paddingVertical: scale(8),
    paddingHorizontal: scale(12)
  },
  chipSelected: { backgroundColor: '#0E9FBE' },
  chipText: { color: '#D4E2FF', fontWeight: '700', fontSize: scale(12) },
  card: { borderRadius: scale(16), padding: scale(14), marginBottom: scale(10) },
  cardTitle: { color: '#EAF0FF', fontSize: scale(18), fontWeight: '800', marginBottom: scale(8) },
  cardText: { color: '#CFDAF4', fontSize: scale(14), marginBottom: scale(6), lineHeight: scale(20) },
  cta: {
    marginTop: scale(8),
    backgroundColor: '#0E9FBE',
    borderRadius: scale(28),
    paddingVertical: scale(14),
    alignItems: 'center'
  },
  ctaText: { color: '#fff', fontSize: scale(16), fontWeight: '800' }
});
