import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { illnessData, illnessOptions } from '../data/illnessData';
import { t } from '../i18n/translations';
import { gradients, palette, scale, scaledFont } from '../theme';

export default function LanguageScreen({ navigation }) {
  const { language, saveLanguage, saveIllnesses, selectedIllnesses, isReady, user, profileComplete, textScale } = useApp();
  const [choice, setChoice] = useState(language || 'en');
  const [illnessChoice, setIllnessChoice] = useState(selectedIllnesses || ['hypertension']);

  useEffect(() => {
    if (isReady && language) {
      setChoice(language);
    }
    if (isReady && selectedIllnesses?.length) {
      setIllnessChoice(selectedIllnesses);
    }
  }, [isReady, language, selectedIllnesses]);

  const toggleChoice = (illnessKey) => {
    if (illnessChoice.includes(illnessKey)) {
      if (illnessChoice.length === 1) return;
      setIllnessChoice(illnessChoice.filter((i) => i !== illnessKey));
      return;
    }
    setIllnessChoice([...illnessChoice, illnessKey]);
  };

  const proceed = async () => {
    await saveLanguage(choice);
    await saveIllnesses(illnessChoice);
    if (!user?.name || !user?.phone) {
      navigation.replace('Auth');
      return;
    }
    if (!profileComplete) {
      navigation.replace('ProfileSetup');
      return;
    }
    navigation.replace('MainTabs');
  };

  return (
    <LinearGradient colors={gradients.splash} style={styles.wrap}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { fontSize: scaledFont(42, textScale) }]}>{t(choice, 'appName')}+</Text>
          <Text style={[styles.subtitle, { fontSize: scaledFont(16, textScale) }]}>{t(choice, 'chooseLanguage')}</Text>

          <View style={styles.panel}>
            <View style={styles.row}>
              <Pressable
                style={[styles.langButton, choice === 'en' && styles.langSelected]}
                onPress={() => setChoice('en')}
              >
                <Text style={styles.langText}>{t('en', 'english')}</Text>
              </Pressable>
              <Pressable
                style={[styles.langButton, choice === 'hi' && styles.langSelected]}
                onPress={() => setChoice('hi')}
              >
                <Text style={styles.langText}>{t('hi', 'hindi')}</Text>
              </Pressable>
            </View>

            <Text style={styles.diseaseTitle}>{t(choice, 'chooseDisease')}</Text>
            <View style={styles.chipsWrap}>
              {illnessOptions.map((key) => {
                const selected = illnessChoice.includes(key);
                return (
                  <Pressable
                    key={key}
                    style={[styles.diseaseChip, selected && styles.diseaseChipSelected]}
                    onPress={() => toggleChoice(key)}
                  >
                    <Text style={styles.diseaseText}>{illnessData[key].labels[choice]}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable style={styles.cta} onPress={proceed}>
            <LinearGradient colors={[palette.brandStart, palette.brandEnd]} style={styles.ctaInner}>
              <Text style={styles.ctaText}>{t(choice, 'continue')}</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  safe: {
    flex: 1
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    padding: scale(24)
  },
  title: {
    fontWeight: '800',
    color: palette.textPrimary
  },
  subtitle: {
    marginTop: scale(14),
    color: '#C9EAF3'
  },
  panel: {
    width: '100%',
    marginTop: scale(24),
    padding: scale(18),
    borderRadius: scale(18),
    backgroundColor: 'rgba(16,42,58,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(168,203,214,0.2)'
  },
  row: {
    flexDirection: 'row',
    gap: scale(12)
  },
  diseaseTitle: {
    marginTop: scale(22),
    marginBottom: scale(10),
    fontSize: scale(17),
    fontWeight: '700',
    color: '#DDEFF5'
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: scale(10)
  },
  diseaseChip: {
    backgroundColor: '#21314F',
    borderRadius: scale(18),
    borderColor: '#3A5C79',
    borderWidth: 1,
    paddingVertical: scale(9),
    paddingHorizontal: scale(14)
  },
  diseaseChipSelected: {
    backgroundColor: '#1C3A50',
    borderColor: palette.brandStart
  },
  diseaseText: {
    color: '#F0F4FF',
    fontWeight: '700'
  },
  langButton: {
    backgroundColor: '#21314F',
    borderWidth: 1,
    borderColor: '#3A5C79',
    borderRadius: scale(14),
    paddingVertical: scale(12),
    paddingHorizontal: scale(20)
  },
  langSelected: {
    borderColor: palette.brandStart,
    backgroundColor: '#1C3A50'
  },
  langText: {
    fontSize: scale(15),
    fontWeight: '700',
    color: '#EAF8FF'
  },
  cta: {
    marginTop: scale(28),
    width: '100%',
    borderRadius: scale(30),
    overflow: 'hidden'
  },
  ctaInner: {
    paddingVertical: scale(14),
    alignItems: 'center'
  },
  ctaText: {
    color: '#fff',
    fontSize: scale(18),
    fontWeight: '700'
  }
});
