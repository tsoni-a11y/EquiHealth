import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { scale, scaledFont } from '../theme';

const tabs = ['bloodPressure', 'bloodGlucose', 'cholesterol', 'medication', 'meals'];

export default function AllLogsScreen({ navigation }) {
  const { language, textScale, metricLogs, medicationHistory, mealHistory, selectedMedications, medicationCatalog, addMetricLog, addMedicationLog } = useApp();
  const [activeTab, setActiveTab] = useState('bloodPressure');
  const [expanded, setExpanded] = useState(false);
  const [logNote, setLogNote] = useState('');
  const [medTaken, setMedTaken] = useState(true);
  const [sysValue, setSysValue] = useState(120);
  const [diaValue, setDiaValue] = useState(80);
  const [sugarValue, setSugarValue] = useState(120);
  const [cholValue, setCholValue] = useState(100);

  const medOptions = selectedMedications.length ? selectedMedications : medicationCatalog;
  const [selectedLogMed, setSelectedLogMed] = useState(medOptions[0] || '');

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'allLogsTitle') });
  }, [navigation, language]);

  const tabLabel = {
    bloodPressure: t(language, 'logsBloodPressure'),
    bloodGlucose: t(language, 'logsBloodGlucose'),
    cholesterol: t(language, 'logsCholesterol'),
    medication: t(language, 'logsMedication'),
    meals: t(language, 'logsMeals')
  };

  const activeLogs = useMemo(() => {
    if (activeTab === 'medication') {
      return medicationHistory.map((entry) => ({
        id: entry.id,
        value: `${entry.medName} - ${entry.taken ? t(language, 'taken') : t(language, 'missed')}`,
        note: new Date(entry.createdAt).toLocaleString(),
        createdAt: entry.createdAt
      }));
    }

    if (activeTab === 'meals') {
      return mealHistory.map((entry) => ({
        id: entry.id,
        value: `${t(language, entry.mealKey)} - ${entry.done ? t(language, 'done') : t(language, 'skipped')}`,
        note: new Date(entry.createdAt).toLocaleString(),
        createdAt: entry.createdAt
      }));
    }

    return metricLogs[activeTab] || [];
  }, [activeTab, metricLogs, medicationHistory, mealHistory, language]);

  const resetForm = () => {
    setLogNote('');
    setMedTaken(true);
  };

  React.useEffect(() => {
    if (!medOptions.length) {
      setSelectedLogMed('');
      return;
    }
    if (!medOptions.includes(selectedLogMed)) {
      setSelectedLogMed(medOptions[0]);
    }
  }, [medOptions, selectedLogMed]);

  const handleAddLog = async () => {
    let ok = false;

    if (activeTab === 'medication') {
      ok = await addMedicationLog({ medName: selectedLogMed, taken: medTaken });
    } else if (activeTab === 'bloodPressure') {
      ok = await addMetricLog({ metricKey: activeTab, value: `${Math.round(sysValue)}/${Math.round(diaValue)}`, note: logNote });
    } else if (activeTab === 'bloodGlucose') {
      ok = await addMetricLog({ metricKey: activeTab, value: `${Math.round(sugarValue)} mg/dL`, note: logNote });
    } else {
      ok = await addMetricLog({ metricKey: activeTab, value: `LDL ${Math.round(cholValue)}`, note: logNote });
    }

    if (!ok) {
      Alert.alert(t(language, 'reminderError'));
      return;
    }

    resetForm();
    Alert.alert(t(language, 'logAdded'));
  };

  const last = activeLogs[0];

  return (
    <LinearGradient colors={['#111822', '#1B2D3D']} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { fontSize: scaledFont(28, textScale) }]}>{t(language, 'allLogsTitle')}</Text>

          <View style={styles.tabsRow}>
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tabChip, activeTab === tab && styles.tabChipActive]}
                onPress={() => {
                  setActiveTab(tab);
                  setExpanded(false);
                  resetForm();
                }}
              >
                <Text style={styles.tabText}>{tabLabel[tab]}</Text>
              </Pressable>
            ))}
          </View>

          {activeTab !== 'meals' ? <View style={styles.addBlock}>
            <Text style={styles.addTitle}>{t(language, 'addLog')}</Text>

            {activeTab === 'bloodPressure' ? (
              <View>
                <Text style={styles.sliderLabel}>{t(language, 'systolic')}: {Math.round(sysValue)}</Text>
                <Slider minimumValue={90} maximumValue={200} step={1} value={sysValue} onValueChange={setSysValue} minimumTrackTintColor="#0E9FBE" maximumTrackTintColor="#4A6470" thumbTintColor="#6CCB4F" />
                <Text style={styles.sliderLabel}>{t(language, 'diastolic')}: {Math.round(diaValue)}</Text>
                <Slider minimumValue={50} maximumValue={130} step={1} value={diaValue} onValueChange={setDiaValue} minimumTrackTintColor="#0E9FBE" maximumTrackTintColor="#4A6470" thumbTintColor="#6CCB4F" />
              </View>
            ) : activeTab === 'bloodGlucose' ? (
              <View>
                <Text style={styles.sliderLabel}>{t(language, 'glucose')}: {Math.round(sugarValue)} mg/dL</Text>
                <Slider minimumValue={70} maximumValue={260} step={1} value={sugarValue} onValueChange={setSugarValue} minimumTrackTintColor="#0E9FBE" maximumTrackTintColor="#4A6470" thumbTintColor="#6CCB4F" />
              </View>
            ) : activeTab === 'cholesterol' ? (
              <View>
                <Text style={styles.sliderLabel}>{t(language, 'cholesterolLdl')}: {Math.round(cholValue)}</Text>
                <Slider minimumValue={70} maximumValue={240} step={1} value={cholValue} onValueChange={setCholValue} minimumTrackTintColor="#0E9FBE" maximumTrackTintColor="#4A6470" thumbTintColor="#6CCB4F" />
              </View>
            ) : (
              <View style={styles.pillsRow}>
                {medOptions.map((med) => (
                  <Pressable key={med} style={[styles.pill, selectedLogMed === med && styles.pillActive]} onPress={() => setSelectedLogMed(med)}>
                    <Text style={styles.pillText}>{med}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {activeTab === 'medication' && !medOptions.length ? (
              <Text style={styles.noHistory}>{t(language, 'noMeds')}</Text>
            ) : null}

            {activeTab !== 'medication' ? (
              <TextInput
                value={logNote}
                onChangeText={setLogNote}
                placeholder={t(language, 'notesOptional')}
                placeholderTextColor="#9DB3C7"
                style={styles.input}
              />
            ) : null}

            {activeTab === 'medication' ? (
              <View style={styles.pillsRow}>
                <Pressable style={[styles.pill, medTaken && styles.pillActive]} onPress={() => setMedTaken(true)}>
                  <Text style={styles.pillText}>{t(language, 'taken')}</Text>
                </Pressable>
                <Pressable style={[styles.pill, !medTaken && styles.pillActive]} onPress={() => setMedTaken(false)}>
                  <Text style={styles.pillText}>{t(language, 'missed')}</Text>
                </Pressable>
              </View>
            ) : null}

            <Pressable style={styles.addBtn} onPress={handleAddLog}>
              <Text style={styles.addBtnText}>{t(language, 'saveLog')}</Text>
            </Pressable>
          </View> : null}

          <Pressable style={styles.mainCard} onPress={() => setExpanded((prev) => !prev)}>
            <Text style={styles.mainTitle}>{tabLabel[activeTab]}</Text>
            <Text style={styles.lastLabel}>{t(language, 'lastRecorded')}</Text>
            <Text style={styles.mainValue}>{last?.value || t(language, 'none')}</Text>
            <Text style={styles.mainNote}>{last?.note || t(language, 'noHistory')}</Text>
            <View style={styles.expandRow}>
              <Text style={styles.expandLabel}>{expanded ? t(language, 'hideHistory') : t(language, 'showHistory')}</Text>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={scale(18)} color="#BFD0E0" />
            </View>
          </Pressable>

          {expanded && (
            <View style={styles.historyBlock}>
              {activeLogs.slice(1).length ? (
                activeLogs.slice(1).map((log) => (
                  <View key={log.id} style={styles.historyCard}>
                    <Text style={styles.historyValue}>{log.value}</Text>
                    <Text style={styles.historyTime}>{new Date(log.createdAt).toLocaleString()}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noHistory}>{t(language, 'noHistory')}</Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: scale(16), paddingBottom: scale(24) },
  title: { color: '#EEF6FF', fontWeight: '800', marginBottom: scale(10) },
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(8), marginBottom: scale(10) },
  tabChip: {
    backgroundColor: '#1C3346',
    borderRadius: scale(18),
    paddingVertical: scale(7),
    paddingHorizontal: scale(10)
  },
  tabChipActive: { backgroundColor: '#0E9FBE' },
  tabText: { color: '#E2EEFA', fontSize: scale(12), fontWeight: '700' },
  mainCard: {
    backgroundColor: '#1C3346',
    borderRadius: scale(16),
    padding: scale(14),
    marginBottom: scale(10)
  },
  mainTitle: { color: '#E2EEFA', fontSize: scale(18), fontWeight: '800' },
  lastLabel: { color: '#A6BED2', marginTop: scale(6), fontSize: scale(12) },
  mainValue: { color: '#0E9FBE', fontSize: scale(28), fontWeight: '800', marginTop: scale(2) },
  mainNote: { color: '#A6BED2', marginTop: scale(4) },
  expandRow: { marginTop: scale(8), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  expandLabel: { color: '#BFD0E0', fontWeight: '700' },
  historyBlock: { marginTop: scale(2) },
  historyCard: {
    backgroundColor: '#243A4D',
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: scale(8)
  },
  historyValue: { color: '#EAF6FF', fontWeight: '700' },
  historyTime: { color: '#BFD0E0', marginTop: scale(4), fontSize: scale(12) },
  noHistory: { color: '#BFD0E0', textAlign: 'center', marginTop: scale(8) },
  addBlock: {
    backgroundColor: '#1C3346',
    borderRadius: scale(14),
    padding: scale(12),
    marginBottom: scale(10)
  },
  addTitle: { color: '#E2EEFA', fontWeight: '800', marginBottom: scale(8) },
  sliderLabel: { color: '#BFD0E0', fontWeight: '700', marginBottom: scale(4), marginTop: scale(2) },
  input: {
    backgroundColor: '#223C52',
    borderWidth: 1,
    borderColor: '#2F5572',
    borderRadius: scale(10),
    color: '#EAF6FF',
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    marginBottom: scale(8)
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: scale(8)
  },
  pill: {
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#2F5572',
    backgroundColor: '#223C52',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8)
  },
  pillActive: {
    backgroundColor: '#0E9FBE',
    borderColor: '#0E9FBE'
  },
  pillText: {
    color: '#E2EEFA',
    fontWeight: '700'
  },
  addBtn: {
    backgroundColor: '#0E9FBE',
    borderRadius: scale(10),
    paddingVertical: scale(11),
    alignItems: 'center'
  },
  addBtnText: { color: '#062331', fontWeight: '800' }
});
