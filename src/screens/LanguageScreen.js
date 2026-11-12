import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { illnessData, illnessOptions } from '../data/illnessData';
import { t } from '../i18n/translations';
import { colors, fonts, scale, scaledFont, spacing, type } from '../theme';
import { Button, Card, Chip, Screen, SectionTitle } from '../components/ui';

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
    <Screen safeTop contentStyle={styles.content}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Ionicons name="heart" size={scale(30)} color={colors.onAccent} />
        </View>
        <Text style={[styles.appName, { fontSize: scaledFont(34, textScale) }]}>{t(choice, 'appName')}</Text>
        <Text style={[type.muted, styles.center]}>{t(choice, 'chooseLanguage')}</Text>
      </View>

      <Card tone="plain">
        <View style={styles.row}>
          <Chip label={t('en', 'english')} selected={choice === 'en'} onPress={() => setChoice('en')} />
          <Chip label={t('hi', 'hindi')} selected={choice === 'hi'} onPress={() => setChoice('hi')} />
        </View>

        <SectionTitle style={styles.diseaseTitle}>{t(choice, 'chooseDisease')}</SectionTitle>
        <View style={styles.row}>
          {illnessOptions.map((key) => (
            <Chip
              key={key}
              tone="green"
              label={illnessData[key].labels[choice]}
              selected={illnessChoice.includes(key)}
              onPress={() => toggleChoice(key)}
            />
          ))}
        </View>
      </Card>

      <Button label={t(choice, 'continue')} icon="arrow-forward" onPress={proceed} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  brand: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  logo: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(20),
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs
  },
  appName: { fontFamily: fonts.bold, color: colors.text },
  center: { textAlign: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  diseaseTitle: { marginTop: spacing.lg, marginBottom: spacing.md },
  cta: { marginTop: spacing.md }
});
