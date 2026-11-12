import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { illnessData } from '../data/illnessData';
import { t } from '../i18n/translations';
import { colors, scale, spacing, type } from '../theme';
import { Button, Card, Chip, Screen } from '../components/ui';

function InfoCard({ tone, icon, iconColor, title, lines }) {
  return (
    <Card tone={tone}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={scale(22)} color={iconColor} />
        <Text style={[type.heading, { flex: 1 }]}>{title}</Text>
      </View>
      {(lines || []).map((line) => (
        <View key={line} style={styles.lineRow}>
          <View style={[styles.bullet, { backgroundColor: iconColor }]} />
          <Text style={[type.body, { flex: 1 }]}>{line}</Text>
        </View>
      ))}
    </Card>
  );
}

export default function DiseaseInfoScreen({ navigation }) {
  const { language, textScale, primaryIllness, selectedIllnesses, setPrimaryIllness, getInfoCard, saveLanguage } = useApp();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'diseaseInfo') });
  }, [navigation, language]);

  const info = getInfoCard(language);

  return (
    <Screen title={t(language, 'diseaseInfo')} subtitle={t(language, 'diseaseInfoSubtitle')} textScale={textScale}>
      {selectedIllnesses.length > 1 ? (
        <View style={styles.chipsRow}>
          {selectedIllnesses.map((key) => (
            <Chip key={key} label={illnessData[key].labels[language]} selected={primaryIllness === key} onPress={() => setPrimaryIllness(key)} />
          ))}
        </View>
      ) : null}

      <InfoCard tone="blue" icon="information-circle-outline" iconColor={colors.blueText} title={info?.whatIsTitle} lines={info?.whatIsLines} />
      <InfoCard tone="green" icon="medkit-outline" iconColor={colors.greenText} title={info?.medicationTitle} lines={info?.medicationLines} />
      <InfoCard tone="warning" icon="warning-outline" iconColor={colors.warning} title={info?.warningTitle} lines={info?.warningLines} />

      {language !== 'hi' ? (
        <Button variant="secondary" icon="language-outline" label={t(language, 'readInHindi')} onPress={() => saveLanguage('hi')} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  lineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.xs },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: scale(9) }
});
