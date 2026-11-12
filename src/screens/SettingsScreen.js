import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useApp } from '../context/AppContext';
import { illnessData, illnessOptions } from '../data/illnessData';
import { t } from '../i18n/translations';
import { colors, fonts, radius, scale, scaledFont, spacing, type } from '../theme';
import { Button, Card, Chip, Screen, SectionTitle } from '../components/ui';

export default function SettingsScreen({ navigation }) {
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
    <Screen safeTop title={t(langChoice, 'settingsTitle')} textScale={textScale}>
      <Card tone="plain" style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={scale(24)} color={colors.blueText} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.bodyStrong}>{user?.name || '-'}</Text>
          <Text style={type.muted}>{user?.phone || '-'}</Text>
        </View>
      </Card>

      <SectionTitle>{t(langChoice, 'languageSetting')}</SectionTitle>
      <View style={styles.rowWrap}>
        <Chip label={t('en', 'english')} selected={langChoice === 'en'} onPress={() => setLangChoice('en')} />
        <Chip label={t('hi', 'hindi')} selected={langChoice === 'hi'} onPress={() => setLangChoice('hi')} />
      </View>

      <SectionTitle>{t(langChoice, 'illnessSetting')}</SectionTitle>
      <View style={styles.rowWrap}>
        {illnessOptions.map((key) => (
          <Chip
            key={key}
            tone="green"
            label={illnessData[key].labels[langChoice]}
            selected={illnessChoices.includes(key)}
            onPress={() => toggleChoice(key)}
          />
        ))}
      </View>

      <SectionTitle>{t(langChoice, 'accessibility')}</SectionTitle>
      <Card tone="plain">
        <Text style={type.label}>
          {t(langChoice, 'textSize')}: <Text style={styles.value}>{scaleChoice.toFixed(2)}x</Text>
        </Text>
        <Slider
          minimumValue={0.9}
          maximumValue={1.4}
          step={0.05}
          value={scaleChoice}
          minimumTrackTintColor={colors.blue}
          maximumTrackTintColor={colors.borderStrong}
          thumbTintColor={colors.blue}
          onValueChange={setScaleChoice}
          accessibilityLabel={t(langChoice, 'textSize')}
        />
        <View style={styles.preview}>
          <Text style={[type.body, { fontSize: scaledFont(16, scaleChoice), lineHeight: scaledFont(23, scaleChoice) }]}>
            {t(langChoice, 'textPreview')}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.rowLine}>
          <View style={{ flex: 1 }}>
            <Text style={[type.bodyStrong, { color: colors.textMuted }]}>{t(langChoice, 'voiceAssist')}</Text>
            <Text style={type.label}>{t(langChoice, 'voiceComingSoon')}</Text>
          </View>
          <Switch value={false} disabled onValueChange={() => {}} />
        </View>
      </Card>

      <Button label={t(langChoice, 'saveSettings')} icon="checkmark" onPress={onSave} style={{ marginTop: spacing.sm }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  value: { fontFamily: fonts.semibold, color: colors.text },
  preview: { backgroundColor: colors.surface, borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  rowLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }
});
