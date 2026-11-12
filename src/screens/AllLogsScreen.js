import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { colors, fonts, scale, spacing, type } from '../theme';
import { Button, Card, Chip, Input, Screen } from '../components/ui';

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

  const sliderColors = {
    minimumTrackTintColor: colors.blue,
    maximumTrackTintColor: colors.borderStrong,
    thumbTintColor: colors.blue
  };

  return (
    <Screen title={t(language, 'allLogsTitle')} textScale={textScale}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <Chip
            key={tab}
            label={tabLabel[tab]}
            selected={activeTab === tab}
            onPress={() => {
              setActiveTab(tab);
              setExpanded(false);
              resetForm();
            }}
          />
        ))}
      </View>

      <Card tone="blue">
        <Text style={[type.label, { color: colors.blueText }]}>{t(language, 'lastRecorded')} · {tabLabel[activeTab]}</Text>
        <Text style={styles.mainValue}>{last?.value || t(language, 'none')}</Text>
        <Text style={type.muted}>{last?.note || t(language, 'noHistory')}</Text>
      </Card>

      {activeTab !== 'meals' ? (
        <Card tone="plain">
          <Text style={[type.heading, styles.addTitle]}>{t(language, 'addLog')}</Text>

          {activeTab === 'bloodPressure' ? (
            <View>
              <Text style={styles.sliderLabel}>{t(language, 'systolic')}: <Text style={styles.sliderValue}>{Math.round(sysValue)}</Text></Text>
              <Slider minimumValue={90} maximumValue={200} step={1} value={sysValue} onValueChange={setSysValue} {...sliderColors} />
              <Text style={styles.sliderLabel}>{t(language, 'diastolic')}: <Text style={styles.sliderValue}>{Math.round(diaValue)}</Text></Text>
              <Slider minimumValue={50} maximumValue={130} step={1} value={diaValue} onValueChange={setDiaValue} {...sliderColors} />
            </View>
          ) : activeTab === 'bloodGlucose' ? (
            <View>
              <Text style={styles.sliderLabel}>{t(language, 'glucose')}: <Text style={styles.sliderValue}>{Math.round(sugarValue)} mg/dL</Text></Text>
              <Slider minimumValue={70} maximumValue={260} step={1} value={sugarValue} onValueChange={setSugarValue} {...sliderColors} />
            </View>
          ) : activeTab === 'cholesterol' ? (
            <View>
              <Text style={styles.sliderLabel}>{t(language, 'cholesterolLdl')}: <Text style={styles.sliderValue}>{Math.round(cholValue)}</Text></Text>
              <Slider minimumValue={70} maximumValue={240} step={1} value={cholValue} onValueChange={setCholValue} {...sliderColors} />
            </View>
          ) : (
            <View style={styles.pillsRow}>
              {medOptions.map((med) => (
                <Chip key={med} label={med} selected={selectedLogMed === med} onPress={() => setSelectedLogMed(med)} />
              ))}
            </View>
          )}

          {activeTab === 'medication' && !medOptions.length ? (
            <Text style={type.muted}>{t(language, 'noMeds')}</Text>
          ) : null}

          {activeTab !== 'medication' ? (
            <Input value={logNote} onChangeText={setLogNote} placeholder={t(language, 'notesOptional')} style={styles.noteInput} />
          ) : null}

          {activeTab === 'medication' ? (
            <View style={styles.pillsRow}>
              <Chip tone="green" label={t(language, 'taken')} selected={medTaken} onPress={() => setMedTaken(true)} />
              <Chip label={t(language, 'missed')} selected={!medTaken} onPress={() => setMedTaken(false)} />
            </View>
          ) : null}

          <Button label={t(language, 'saveLog')} variant="green" icon="checkmark" onPress={handleAddLog} style={styles.saveButton} />
        </Card>
      ) : null}

      <Button
        variant="secondary"
        icon={expanded ? 'chevron-up' : 'chevron-down'}
        label={expanded ? t(language, 'hideHistory') : t(language, 'showHistory')}
        onPress={() => setExpanded((prev) => !prev)}
      />

      {expanded ? (
        activeLogs.slice(1).length ? (
          <Card tone="plain" style={styles.historyCard}>
            {activeLogs.slice(1).map((log, idx) => (
              <View key={log.id} style={[styles.historyRow, idx > 0 && styles.rowDivider]}>
                <Text style={type.bodyStrong}>{log.value}</Text>
                <Text style={type.muted}>{new Date(log.createdAt).toLocaleString()}</Text>
              </View>
            ))}
          </Card>
        ) : (
          <Text style={[type.muted, styles.center]}>{t(language, 'noHistory')}</Text>
        )
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  mainValue: { fontFamily: fonts.bold, fontSize: scale(28), lineHeight: scale(34), color: colors.text, marginVertical: spacing.xs },
  addTitle: { marginBottom: spacing.sm },
  sliderLabel: { ...type.label, marginTop: spacing.sm },
  sliderValue: { fontFamily: fonts.semibold, color: colors.text },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  noteInput: { marginTop: spacing.md },
  saveButton: { marginTop: spacing.md },
  historyCard: { paddingVertical: spacing.xs },
  historyRow: { paddingVertical: spacing.md, gap: 2 },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  center: { textAlign: 'center' }
});
