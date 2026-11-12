import React, { useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { illnessData, illnessOptions } from '../data/illnessData';
import { t } from '../i18n/translations';
import { colors, radius, scale, spacing, type } from '../theme';
import { Card, CheckRow, Chip, Input, Screen, SectionTitle } from '../components/ui';

export default function ConditionsScreen({ navigation }) {
  const { language, selectedIllnesses, toggleIllness, selectedMedications, getCombinedMedications, toggleMedicationSelection, addCustomMedication, textScale } = useApp();
  const [customMed, setCustomMed] = React.useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'conditionsAndMeds') });
  }, [navigation, language]);

  const meds = getCombinedMedications(language);

  const onAdd = async () => {
    await addCustomMedication(customMed);
    setCustomMed('');
  };

  return (
    <Screen safeTop title={t(language, 'conditionsAndMeds')} textScale={textScale}>
      <SectionTitle>{t(language, 'selectIllness')}</SectionTitle>
      <View style={styles.chipsRow}>
        {illnessOptions.map((key) => (
          <Chip
            key={key}
            tone="green"
            label={illnessData[key].labels[language]}
            selected={selectedIllnesses.includes(key)}
            onPress={() => toggleIllness(key)}
          />
        ))}
      </View>

      <SectionTitle>{t(language, 'autoPopulatedMeds')}</SectionTitle>
      <Card tone="plain" style={styles.listCard}>
        {meds.length ? (
          meds.map((med) => (
            <CheckRow key={med} label={med} checked={selectedMedications.includes(med)} onPress={() => toggleMedicationSelection(med)} />
          ))
        ) : (
          <Text style={type.muted}>{t(language, 'noMeds')}</Text>
        )}
      </Card>

      <View style={styles.customRow}>
        <Input
          style={styles.customInput}
          value={customMed}
          onChangeText={setCustomMed}
          placeholder={t(language, 'medName')}
          returnKeyType="done"
          onSubmitEditing={onAdd}
        />
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.7 }]}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t(language, 'medName')}
        >
          <Ionicons name="add" size={scale(26)} color={colors.onAccent} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  listCard: { paddingVertical: spacing.sm },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  customInput: { flex: 1 },
  addBtn: {
    width: scale(52),
    height: scale(52),
    borderRadius: radius.md,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
