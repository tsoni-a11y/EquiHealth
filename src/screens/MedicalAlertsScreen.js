import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { gradients, scale } from '../theme';

const mealKeys = ['breakfast', 'lunch', 'dinner'];

export default function MedicalAlertsScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const { language, reminders, mealReminders, medicationCatalog, selectedMedications, addReminder, updateMealReminder, removeReminder } = useApp();
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

  return (
    <LinearGradient colors={gradients.alerts} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + scale(24) }]}>
          <View style={styles.selectBlock}>
            <Text style={styles.label}>{t(language, 'selectMedication')}</Text>
            <Picker selectedValue={selectedMed} style={styles.picker} dropdownIconColor="#fff" onValueChange={(value) => setSelectedMed(value)}>
              <Picker.Item label={t(language, 'selectMedication')} value="" color="#DDD" />
              {medOptions.map((med) => (
                <Picker.Item key={med} label={med} value={med} color="#FFF" />
              ))}
            </Picker>
          </View>

          <View style={styles.timeBlock}>
            <Text style={styles.label}>{t(language, 'selectTime')}</Text>
            <DateTimePicker
              mode="time"
              display="spinner"
              themeVariant="dark"
              textColor="#FFFFFF"
              value={time}
              onChange={(event, selectedDate) => {
                if (selectedDate) setTime(selectedDate);
              }}
            />
          </View>

          <Pressable style={styles.cta} onPress={handleAddMedicationReminder}>
            <Text style={styles.ctaText}>{t(language, 'addReminder')}</Text>
          </Pressable>

          <Text style={styles.sectionTitle}>{t(language, 'mealReminders')}</Text>
          <View style={styles.savedList}>
            {mealKeys.map((mealKey, idx) => {
              const meal = mealReminders?.[mealKey] || { hour: 8, minute: 0 };
              return (
                <View key={mealKey} style={styles.reminderRow}>
                  <View style={[styles.dot, { backgroundColor: idx % 2 === 0 ? '#0E9FBE' : '#6CCB4F' }]} />
                  <View style={styles.reminderCard}>
                    <Text style={styles.reminderMed}>{t(language, mealKey)}</Text>
                    <Text style={styles.reminderTime}>
                      {String(meal.hour).padStart(2, '0')}:{String(meal.minute).padStart(2, '0')}
                    </Text>
                  </View>
                  <Pressable style={styles.removeBtn} onPress={() => handleEditMeal(mealKey)}>
                    <Text style={styles.removeText}>{t(language, 'edit')}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          {editingMeal ? (
            <View style={styles.editBlock}>
              <Text style={styles.label}>{t(language, 'edit')} {t(language, editingMeal)}</Text>
              <DateTimePicker
                mode="time"
                display="spinner"
                themeVariant="dark"
                textColor="#FFFFFF"
                value={mealTime}
                onChange={(event, selectedDate) => {
                  if (selectedDate) setMealTime(selectedDate);
                }}
              />
              <Pressable style={styles.cta} onPress={handleSaveMealTime}>
                <Text style={styles.ctaText}>{t(language, 'saveTime')}</Text>
              </Pressable>
            </View>
          ) : null}

          <Text style={[styles.sectionTitle, { marginTop: scale(4) }]}>{t(language, 'savedReminders')}</Text>
          <View style={styles.savedList}>
            {reminders.map((item, idx) => (
              <View key={item.id} style={styles.reminderRow}>
                <View style={[styles.dot, { backgroundColor: idx % 2 === 0 ? '#0E9FBE' : '#6CCB4F' }]} />
                <View style={styles.reminderCard}>
                  <Text style={styles.reminderMed}>{item.label || item.medName}</Text>
                  <Text style={styles.reminderTime}>
                    {String(item.hour).padStart(2, '0')}:{String(item.minute).padStart(2, '0')}
                  </Text>
                </View>
                <Pressable style={styles.removeBtn} onPress={() => removeReminder(item.id)}>
                  <Text style={styles.removeText}>{t(language, 'remove')}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: scale(16), paddingBottom: scale(24) },
  selectBlock: {
    backgroundColor: '#322746',
    borderColor: '#5C4A77',
    borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(8),
    marginBottom: scale(12)
  },
  picker: { color: '#FFF' },
  label: { fontSize: scale(14), fontWeight: '700', color: '#F8F2FF', marginBottom: scale(6) },
  timeBlock: {
    backgroundColor: '#322746',
    borderColor: '#5C4A77',
    borderWidth: 1,
    borderRadius: scale(12),
    marginBottom: scale(12),
    paddingTop: scale(10)
  },
  cta: {
    backgroundColor: '#3A2F53',
    borderRadius: scale(12),
    paddingVertical: scale(12),
    alignItems: 'center',
    marginTop: scale(4),
    marginBottom: scale(12)
  },
  ctaText: { color: '#EEE6FF', fontSize: scale(16), fontWeight: '800' },
  sectionTitle: { fontSize: scale(18), fontWeight: '800', color: '#F8F2FF', marginBottom: scale(10) },
  savedList: {
    borderLeftWidth: 3,
    borderLeftColor: '#6A5B8F',
    paddingLeft: scale(10),
    marginBottom: scale(8)
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(10)
  },
  dot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    marginRight: scale(8)
  },
  reminderCard: {
    flex: 1,
    backgroundColor: '#322746',
    borderRadius: scale(12),
    padding: scale(12)
  },
  reminderMed: { fontSize: scale(16), fontWeight: '700', color: '#F7F2FF' },
  reminderTime: { marginTop: scale(4), color: '#DCCFF0' },
  removeBtn: {
    backgroundColor: '#4A3658',
    borderRadius: scale(8),
    paddingVertical: scale(8),
    paddingHorizontal: scale(10),
    marginLeft: scale(8)
  },
  removeText: { color: '#EEE6FF', fontWeight: '700' },
  editBlock: {
    backgroundColor: '#322746',
    borderColor: '#5C4A77',
    borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(10),
    marginBottom: scale(10)
  }
});
