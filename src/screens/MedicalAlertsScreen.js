import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { colors, fonts, radius, scale, spacing, type } from '../theme';
import { Button, Card, FieldLabel, Screen, SectionTitle } from '../components/ui';

const mealKeys = ['breakfast', 'lunch', 'dinner'];

export default function MedicalAlertsScreen({ navigation }) {
  const { language, textScale, reminders, mealReminders, medicationCatalog, selectedMedications, addReminder, updateMealReminder, removeReminder } = useApp();
  const [selectedMed, setSelectedMed] = useState('');
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealTime, setMealTime] = useState(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });

  const medOptions = useMemo(() => (selectedMedications.length ? selectedMedications : medicationCatalog), [selectedMedications, medicationCatalog]);

  React.useEffect(() => {
    if (!medOptions.length) {
      setSelectedMed('');
      return;
    }
    if (!medOptions.includes(selectedMed)) {
      setSelectedMed(medOptions[0]);
    }
  }, [medOptions, selectedMed]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'medicalAlerts') });
  }, [navigation, language]);

  const handleAddMedicationReminder = async () => {
    const h = time.getHours();
    const m = time.getMinutes();

    if (!selectedMed) {
      Alert.alert(t(language, 'reminderError'));
      return;
    }

    try {
      await addReminder({
        label: selectedMed,
        hour: h,
        minute: m,
        langText: {
          medTitle: t(language, 'reminderTitle'),
          body: t(language, 'reminderBody')
        }
      });
      Alert.alert(t(language, 'reminderSaved'));
    } catch {
      Alert.alert(t(language, 'reminderError'));
    }
  };

  const handleEditMeal = (mealKey) => {
    setEditingMeal(mealKey);
    const existing = mealReminders?.[mealKey];
    const d = new Date();
    d.setHours(existing?.hour ?? 8, existing?.minute ?? 0, 0, 0);
    setMealTime(d);
  };

  const handleSaveMealTime = async () => {
    if (!editingMeal) return;

    try {
      await updateMealReminder({
        mealKey: editingMeal,
        hour: mealTime.getHours(),
        minute: mealTime.getMinutes(),
        langText: {
          mealTitle: t(language, 'mealReminderTitle'),
          mealLabel: t(language, editingMeal),
          body: t(language, 'reminderBody')
        }
      });
      setEditingMeal(null);
      Alert.alert(t(language, 'reminderSaved'));
    } catch {
      Alert.alert(t(language, 'reminderError'));
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <Screen safeTop title={t(language, 'medicalAlerts')} textScale={textScale}>
      <SectionTitle>{t(language, 'addReminder')}</SectionTitle>
      <Card tone="plain">
        <FieldLabel>{t(language, 'selectMedication')}</FieldLabel>
        <Picker
          selectedValue={selectedMed}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          dropdownIconColor={colors.textMuted}
          onValueChange={(value) => setSelectedMed(value)}
        >
          <Picker.Item label={t(language, 'selectMedication')} value="" color={colors.placeholder} />
          {medOptions.map((med) => (
            <Picker.Item key={med} label={med} value={med} color={colors.text} />
          ))}
        </Picker>

        <FieldLabel>{t(language, 'selectTime')}</FieldLabel>
        <DateTimePicker
          mode="time"
          display="spinner"
          themeVariant="light"
          textColor={colors.text}
          value={time}
          onChange={(event, selectedDate) => {
            if (selectedDate) setTime(selectedDate);
          }}
        />

        <Button label={t(language, 'addReminder')} icon="add" onPress={handleAddMedicationReminder} style={styles.cardButton} />
      </Card>

      <SectionTitle>{t(language, 'mealReminders')}</SectionTitle>
      <Card tone="plain" style={styles.listCard}>
        {mealKeys.map((mealKey, idx) => {
          const meal = mealReminders?.[mealKey] || { hour: 8, minute: 0 };
          return (
            <View key={mealKey} style={[styles.reminderRow, idx > 0 && styles.rowDivider]}>
              <View style={[styles.reminderIcon, { backgroundColor: colors.greenSoft }]}>
                <Ionicons name="restaurant-outline" size={scale(18)} color={colors.greenText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.bodyStrong}>{t(language, mealKey)}</Text>
                <Text style={type.muted}>{pad(meal.hour)}:{pad(meal.minute)}</Text>
              </View>
              <Button small variant="secondary" label={t(language, 'edit')} onPress={() => handleEditMeal(mealKey)} />
            </View>
          );
        })}
      </Card>

      {editingMeal ? (
        <Card tone="green">
          <FieldLabel>{t(language, 'edit')} {t(language, editingMeal)}</FieldLabel>
          <DateTimePicker
            mode="time"
            display="spinner"
            themeVariant="light"
            textColor={colors.text}
            value={mealTime}
            onChange={(event, selectedDate) => {
              if (selectedDate) setMealTime(selectedDate);
            }}
          />
          <Button label={t(language, 'saveTime')} variant="green" icon="checkmark" onPress={handleSaveMealTime} style={styles.cardButton} />
        </Card>
      ) : null}

      <SectionTitle>{t(language, 'savedReminders')}</SectionTitle>
      {reminders.length ? (
        <Card tone="plain" style={styles.listCard}>
          {reminders.map((item, idx) => (
            <View key={item.id} style={[styles.reminderRow, idx > 0 && styles.rowDivider]}>
              <View style={[styles.reminderIcon, { backgroundColor: colors.blueSoft }]}>
                <Ionicons name="medkit-outline" size={scale(18)} color={colors.blueText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.bodyStrong}>{item.label || item.medName}</Text>
                <Text style={type.muted}>{pad(item.hour)}:{pad(item.minute)}</Text>
              </View>
              <Button small variant="quiet" label={t(language, 'remove')} onPress={() => removeReminder(item.id)} />
            </View>
          ))}
        </Card>
      ) : (
        <Text style={type.muted}>{t(language, 'none')}</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  picker: { color: colors.text },
  pickerItem: { fontFamily: fonts.regular, fontSize: scale(18), color: colors.text },
  cardButton: { marginTop: spacing.md },
  listCard: { paddingVertical: spacing.xs },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  reminderIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
