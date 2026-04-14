import React, { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { illnessData, illnessOptions } from '../data/illnessData';
import { t } from '../i18n/translations';
import { gradients, scale } from '../theme';

export default function ConditionsScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const { language, selectedIllnesses, toggleIllness, selectedMedications, getCombinedMedications, toggleMedicationSelection, addCustomMedication, textScale } = useApp();
  const [customMed, setCustomMed] = React.useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'conditionsAndMeds') });
  }, [navigation, language]);

  const meds = getCombinedMedications(language);

  return (
    <LinearGradient colors={gradients.conditions} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.accentBar} />
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + scale(20) }]}>
          <View style={styles.panel}>
            <Text style={[styles.sectionTitle, { fontSize: scale(17) * textScale }]}>{t(language, 'selectIllness')}</Text>
            <View style={styles.chipsRow}>
              {illnessOptions.map((key) => {
                const selected = selectedIllnesses.includes(key);
                return (
                  <Pressable
                    key={key}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggleIllness(key)}
                  >
                    <Text style={styles.chipText}>{illnessData[key].labels[language]}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { fontSize: scale(17) * textScale }]}>{t(language, 'autoPopulatedMeds')}</Text>
            {meds.length ? (
              meds.map((med) => (
                <Pressable key={med} style={styles.itemCard} onPress={() => toggleMedicationSelection(med)}>
                  <Ionicons
                    name={selectedMedications.includes(med) ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={selectedMedications.includes(med) ? '#6CCB4F' : '#A7C1CC'}
                  />
                  <Text style={styles.itemText}>{med}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyText}>{t(language, 'noMeds')}</Text>
            )}

            <View style={styles.customRow}>
              <TextInput
                style={styles.customInput}
                value={customMed}
                onChangeText={setCustomMed}
                placeholder={t(language, 'medName')}
                placeholderTextColor="#A7C1CC"
              />
              <Pressable
                style={styles.addBtn}
                onPress={async () => {
                  await addCustomMedication(customMed);
                  setCustomMed('');
                }}
              >
                <Text style={styles.addBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  safe: { flex: 1 },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: scale(8),
    backgroundColor: '#0E9FBE'
  },
  container: { padding: scale(16), paddingLeft: scale(20) },
  panel: {
    backgroundColor: '#121D31',
    borderRadius: scale(20),
    padding: scale(14)
  },
  sectionTitle: { fontSize: scale(17), fontWeight: '800', color: '#DCE5FF', marginBottom: scale(10), marginTop: scale(8) },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    backgroundColor: '#21314F',
    borderWidth: 1,
    borderColor: '#3A547A',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  chipSelected: { borderColor: '#0e9fbe', backgroundColor: '#1C3A50' },
  chipText: { fontWeight: '700', color: '#F0F4FF' },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    backgroundColor: '#1C3A50',
    padding: 13,
    borderRadius: 12,
    borderLeftColor: '#0E9FBE',
    borderLeftWidth: 4
  },
  itemText: { color: '#EAF8FF', fontSize: 15 },
  emptyText: { color: '#BFC9E2' },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  customInput: {
    flex: 1,
    backgroundColor: '#1C3A50',
    borderColor: '#3A547A',
    borderWidth: 1,
    borderRadius: 10,
    color: '#EAF8FF',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0E9FBE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addBtnText: { color: '#fff', fontSize: 24, lineHeight: 26, fontWeight: '700' }
});
