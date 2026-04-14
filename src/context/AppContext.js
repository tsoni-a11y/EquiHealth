import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { illnessData } from '../data/illnessData';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

const STORAGE_KEYS = {
  language: 'eh_language',
  illnesses: 'eh_illnesses',
  reminders: 'eh_reminders',
  mealReminders: 'eh_meal_reminders',
  user: 'eh_user',
  profileComplete: 'eh_profile_complete',
  textScale: 'eh_text_scale',
  metricLogs: 'eh_metric_logs',
  medicationHistory: 'eh_medication_history',
  mealHistory: 'eh_meal_history',
  medicationChecklist: 'eh_medication_checklist',
  mealChecklist: 'eh_meal_checklist',
  selectedMedications: 'eh_selected_medications',
  customMedications: 'eh_custom_medications'
};

const AppContext = createContext(null);

const defaultMetricLogs = {
  bloodPressure: [
    { id: 'bp_1', value: '128/82', note: 'Last 7 days: stable', createdAt: new Date().toISOString() },
    { id: 'bp_2', value: '132/84', note: 'Morning reading', createdAt: new Date(Date.now() - 86400000).toISOString() }
  ],
  bloodGlucose: [
    { id: 'bg_1', value: '121 mg/dL', note: 'Fasting: in target range', createdAt: new Date().toISOString() },
    { id: 'bg_2', value: '127 mg/dL', note: 'Before breakfast', createdAt: new Date(Date.now() - 86400000).toISOString() }
  ],
  cholesterol: [
    { id: 'ch_1', value: 'LDL 95', note: 'Monthly update', createdAt: new Date().toISOString() },
    { id: 'ch_2', value: 'LDL 101', note: 'Previous record', createdAt: new Date(Date.now() - 2592000000).toISOString() }
  ]
};

const defaultMealChecklist = { breakfast: false, lunch: false, dinner: false };
const defaultMealReminders = {
  breakfast: { id: null, hour: 8, minute: 0 },
  lunch: { id: null, hour: 13, minute: 0 },
  dinner: { id: null, hour: 20, minute: 0 }
};

const parseJSON = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [selectedIllnesses, setSelectedIllnesses] = useState(['hypertension']);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [customMedications, setCustomMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [mealReminders, setMealReminders] = useState(defaultMealReminders);
  const [user, setUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [accessibility, setAccessibility] = useState({ largeText: false, voiceAssist: false });
  const [metricLogs, setMetricLogs] = useState(defaultMetricLogs);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);
  const [medicationChecklist, setMedicationChecklist] = useState({});
  const [mealChecklist, setMealChecklist] = useState(defaultMealChecklist);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [
        storedLanguage,
        storedIllnesses,
        legacyIllness,
        storedSelectedMedications,
        storedCustomMedications,
        storedReminders,
        storedMealReminders,
        storedUser,
        storedProfileComplete,
        storedTextScale,
        storedMetricLogs,
        storedMedicationHistory,
        storedMealHistory,
        storedMedicationChecklist,
        storedMealChecklist
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.language),
        AsyncStorage.getItem(STORAGE_KEYS.illnesses),
        AsyncStorage.getItem('eh_illness'),
        AsyncStorage.getItem(STORAGE_KEYS.selectedMedications),
        AsyncStorage.getItem(STORAGE_KEYS.customMedications),
        AsyncStorage.getItem(STORAGE_KEYS.reminders),
        AsyncStorage.getItem(STORAGE_KEYS.mealReminders),
        AsyncStorage.getItem(STORAGE_KEYS.user),
        AsyncStorage.getItem(STORAGE_KEYS.profileComplete),
        AsyncStorage.getItem(STORAGE_KEYS.textScale),
        AsyncStorage.getItem(STORAGE_KEYS.metricLogs),
        AsyncStorage.getItem(STORAGE_KEYS.medicationHistory),
        AsyncStorage.getItem(STORAGE_KEYS.mealHistory),
        AsyncStorage.getItem(STORAGE_KEYS.medicationChecklist),
        AsyncStorage.getItem(STORAGE_KEYS.mealChecklist)
      ]);

      if (storedLanguage) setLanguage(storedLanguage);

      const illnessList = parseJSON(storedIllnesses, null);
      if (Array.isArray(illnessList) && illnessList.length) {
        setSelectedIllnesses(illnessList);
      } else if (legacyIllness) {
        setSelectedIllnesses([legacyIllness]);
      }

      setSelectedMedications(parseJSON(storedSelectedMedications, []));
      setCustomMedications(parseJSON(storedCustomMedications, []));
      setReminders(parseJSON(storedReminders, []));
      setMealReminders(parseJSON(storedMealReminders, defaultMealReminders));
      setUser(parseJSON(storedUser, null));
      setProfileComplete(storedProfileComplete === 'true');
      setTextScale(Math.max(0.9, Math.min(1.4, Number(storedTextScale) || 1)));
      setMetricLogs(parseJSON(storedMetricLogs, defaultMetricLogs));
      setMedicationHistory(parseJSON(storedMedicationHistory, []));
      setMealHistory(parseJSON(storedMealHistory, []));
      setMedicationChecklist(parseJSON(storedMedicationChecklist, {}));
      setMealChecklist(parseJSON(storedMealChecklist, defaultMealChecklist));

      const storedUserObj = parseJSON(storedUser, null);
      if (storedUserObj?.accessibility) {
        setAccessibility({
          largeText: !!storedUserObj.accessibility.largeText,
          voiceAssist: !!storedUserObj.accessibility.voiceAssist
        });
      }

      await Notifications.requestPermissionsAsync();
      setIsReady(true);
    };

    init();
  }, []);

  const primaryIllness = selectedIllnesses[0] || 'hypertension';

  const autoMedications = useMemo(() => {
    const meds = selectedIllnesses.flatMap((key) => illnessData[key]?.medications?.[language] || []);
    return Array.from(new Set(meds));
  }, [selectedIllnesses, language]);

  const medicationCatalog = useMemo(() => {
    return Array.from(new Set([...autoMedications, ...customMedications]));
  }, [autoMedications, customMedications]);

  useEffect(() => {
    if (!isReady) return;
    if (!selectedMedications.length && medicationCatalog.length) {
      const defaults = [...autoMedications];
      setSelectedMedications(defaults);
      AsyncStorage.setItem(STORAGE_KEYS.selectedMedications, JSON.stringify(defaults));
    }
  }, [isReady, medicationCatalog, selectedMedications.length, autoMedications]);

  const saveLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.language, lang);
  };

  const saveIllnesses = async (illnesses) => {
    const cleaned = Array.from(new Set(illnesses)).filter(Boolean);
    const next = cleaned.length ? cleaned : ['hypertension'];
    setSelectedIllnesses(next);
    await AsyncStorage.setItem(STORAGE_KEYS.illnesses, JSON.stringify(next));
  };

  const toggleIllness = async (illnessKey) => {
    const exists = selectedIllnesses.includes(illnessKey);
    if (exists && selectedIllnesses.length === 1) return;
    const next = exists ? selectedIllnesses.filter((i) => i !== illnessKey) : [...selectedIllnesses, illnessKey];
    await saveIllnesses(next);
  };

  const setPrimaryIllness = async (illnessKey) => {
    const rest = selectedIllnesses.filter((i) => i !== illnessKey);
    await saveIllnesses([illnessKey, ...rest]);
  };

  const saveSelectedMedications = async (list) => {
    const next = Array.from(new Set(list)).filter(Boolean);
    setSelectedMedications(next);
    await AsyncStorage.setItem(STORAGE_KEYS.selectedMedications, JSON.stringify(next));
  };

  const toggleMedicationSelection = async (medName) => {
    const exists = selectedMedications.includes(medName);
    if (exists && selectedMedications.length === 1) return;
    const next = exists ? selectedMedications.filter((m) => m !== medName) : [...selectedMedications, medName];
    await saveSelectedMedications(next);
  };

  const addCustomMedication = async (medName) => {
    const cleaned = medName.trim();
    if (!cleaned) return;
    const nextCustom = Array.from(new Set([...customMedications, cleaned]));
    const nextSelected = Array.from(new Set([...selectedMedications, cleaned]));
    setCustomMedications(nextCustom);
    setSelectedMedications(nextSelected);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.customMedications, JSON.stringify(nextCustom)),
      AsyncStorage.setItem(STORAGE_KEYS.selectedMedications, JSON.stringify(nextSelected))
    ]);
  };

  const getCombinedMedications = () => medicationCatalog;

  const getDietPlan = (lang) => illnessData[primaryIllness]?.dietPlan?.[lang] || null;
  const getInfoCard = (lang) => illnessData[primaryIllness]?.infoCard?.[lang] || null;

  const addReminder = async ({ label, hour, minute, langText }) => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: langText.medTitle,
        body: `${langText.body}: ${label}`
      },
      trigger: { hour, minute, repeats: true }
    });

    const entry = {
      id: notificationId,
      reminderType: 'medication',
      label,
      hour,
      minute,
      createdAt: new Date().toISOString()
    };
    const updated = [entry, ...reminders];
    setReminders(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(updated));
  };

  const updateMealReminder = async ({ mealKey, hour, minute, langText }) => {
    const oldId = mealReminders?.[mealKey]?.id;
    if (oldId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(oldId);
      } catch {
        // Ignore if old id is stale.
      }
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: langText.mealTitle,
        body: `${langText.body}: ${langText.mealLabel}`
      },
      trigger: { hour, minute, repeats: true }
    });

    const next = {
      ...mealReminders,
      [mealKey]: { id: notificationId, hour, minute }
    };

    setMealReminders(next);
    await AsyncStorage.setItem(STORAGE_KEYS.mealReminders, JSON.stringify(next));
  };

  const removeReminder = async (id) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(updated));
  };

  const getNextReminder = () => {
    const all = [
      ...reminders.map((r) => ({ ...r, label: r.label || r.medName })),
      ...Object.entries(mealReminders || {}).map(([mealKey, val]) => ({
        id: val.id || `meal_${mealKey}`,
        reminderType: 'meal',
        label: mealKey,
        hour: val.hour,
        minute: val.minute,
        createdAt: new Date().toISOString()
      }))
    ];

    if (!all.length) return null;

    const now = new Date();
    const upcoming = all
      .map((r) => {
        const next = new Date();
        next.setHours(r.hour, r.minute, 0, 0);
        if (next <= now) next.setDate(next.getDate() + 1);
        return { ...r, nextAt: next };
      })
      .sort((a, b) => a.nextAt - b.nextAt);

    return upcoming[0] || null;
  };

  const toggleMedicationTaken = async (medName) => {
    const nextChecklist = { ...medicationChecklist, [medName]: !medicationChecklist[medName] };
    setMedicationChecklist(nextChecklist);
    await AsyncStorage.setItem(STORAGE_KEYS.medicationChecklist, JSON.stringify(nextChecklist));

    const entry = {
      id: `med_${Date.now()}`,
      medName,
      taken: !!nextChecklist[medName],
      createdAt: new Date().toISOString()
    };
    const nextHistory = [entry, ...medicationHistory];
    setMedicationHistory(nextHistory);
    await AsyncStorage.setItem(STORAGE_KEYS.medicationHistory, JSON.stringify(nextHistory));
  };

  const toggleMealTaken = async (mealKey) => {
    const nextChecklist = { ...mealChecklist, [mealKey]: !mealChecklist[mealKey] };
    setMealChecklist(nextChecklist);
    await AsyncStorage.setItem(STORAGE_KEYS.mealChecklist, JSON.stringify(nextChecklist));

    const entry = {
      id: `meal_${Date.now()}`,
      mealKey,
      done: !!nextChecklist[mealKey],
      createdAt: new Date().toISOString()
    };
    const nextHistory = [entry, ...mealHistory];
    setMealHistory(nextHistory);
    await AsyncStorage.setItem(STORAGE_KEYS.mealHistory, JSON.stringify(nextHistory));
  };

  const addMetricLog = async ({ metricKey, value, note }) => {
    const cleanedValue = (value || '').trim();
    if (!cleanedValue) return false;

    const entry = {
      id: `${metricKey}_${Date.now()}`,
      value: cleanedValue,
      note: (note || '').trim(),
      createdAt: new Date().toISOString()
    };

    const nextLogs = {
      ...metricLogs,
      [metricKey]: [entry, ...(metricLogs[metricKey] || [])]
    };

    setMetricLogs(nextLogs);
    await AsyncStorage.setItem(STORAGE_KEYS.metricLogs, JSON.stringify(nextLogs));
    return true;
  };

  const addMedicationLog = async ({ medName, taken }) => {
    const cleanedName = (medName || '').trim();
    if (!cleanedName) return false;

    const entry = {
      id: `med_${Date.now()}`,
      medName: cleanedName,
      taken: !!taken,
      createdAt: new Date().toISOString()
    };

    const nextHistory = [entry, ...medicationHistory];
    setMedicationHistory(nextHistory);
    await AsyncStorage.setItem(STORAGE_KEYS.medicationHistory, JSON.stringify(nextHistory));
    return true;
  };

  const addMealLog = async ({ mealKey, done }) => {
    const normalizedMealKey = (mealKey || '').trim();
    if (!normalizedMealKey) return false;

    const entry = {
      id: `meal_${Date.now()}`,
      mealKey: normalizedMealKey,
      done: !!done,
      createdAt: new Date().toISOString()
    };

    const nextHistory = [entry, ...mealHistory];
    setMealHistory(nextHistory);
    await AsyncStorage.setItem(STORAGE_KEYS.mealHistory, JSON.stringify(nextHistory));
    return true;
  };

  const saveUserAuth = async ({ name, phone }) => {
    const nextUser = { ...(user || {}), name, phone };
    setUser(nextUser);
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
  };

  const completeProfileSetup = async ({ age, largeText, voiceAssist }) => {
    const nextUser = {
      ...(user || {}),
      age,
      accessibility: { largeText: !!largeText, voiceAssist: !!voiceAssist }
    };

    const nextScale = largeText ? 1.14 : textScale;
    setUser(nextUser);
    setAccessibility(nextUser.accessibility);
    setProfileComplete(true);
    setTextScale(nextScale);

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser)),
      AsyncStorage.setItem(STORAGE_KEYS.profileComplete, 'true'),
      AsyncStorage.setItem(STORAGE_KEYS.textScale, String(nextScale))
    ]);
  };

  const updateSettings = async ({ lang, illnessKeys, textScaleValue }) => {
    const nextLang = lang || language;
    const nextIllnesses = Array.isArray(illnessKeys) && illnessKeys.length ? illnessKeys : selectedIllnesses;
    const nextScale = Math.max(0.9, Math.min(1.4, Number(textScaleValue) || 1));

    if (nextLang !== language) {
      setLanguage(nextLang);
      await AsyncStorage.setItem(STORAGE_KEYS.language, nextLang);
    }

    if (JSON.stringify(nextIllnesses) !== JSON.stringify(selectedIllnesses)) {
      setSelectedIllnesses(nextIllnesses);
      await AsyncStorage.setItem(STORAGE_KEYS.illnesses, JSON.stringify(nextIllnesses));
    }

    setTextScale(nextScale);
    await AsyncStorage.setItem(STORAGE_KEYS.textScale, String(nextScale));

    const nextAccessibility = { ...(user?.accessibility || {}), largeText: nextScale > 1.05, voiceAssist: false };
    const nextUser = { ...(user || {}), accessibility: nextAccessibility };

    setAccessibility(nextAccessibility);
    setUser(nextUser);
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
  };

  const medicationTotal = selectedMedications.length;
  const medicationTaken = selectedMedications.filter((med) => !!medicationChecklist[med]).length;

  const value = useMemo(
    () => ({
      language,
      saveLanguage,
      selectedIllnesses,
      primaryIllness,
      saveIllnesses,
      toggleIllness,
      setPrimaryIllness,
      selectedMedications,
      medicationCatalog,
      toggleMedicationSelection,
      addCustomMedication,
      saveSelectedMedications,
      reminders,
      mealReminders,
      addReminder,
      updateMealReminder,
      removeReminder,
      nextReminder: getNextReminder(),
      getCombinedMedications,
      getDietPlan,
      getInfoCard,
      metricLogs,
      medicationHistory,
      mealHistory,
      addMetricLog,
      addMedicationLog,
      addMealLog,
      medicationChecklist,
      mealChecklist,
      toggleMedicationTaken,
      toggleMealTaken,
      medicationTotal,
      medicationTaken,
      user,
      saveUserAuth,
      profileComplete,
      completeProfileSetup,
      accessibility,
      textScale,
      updateSettings,
      isReady
    }),
    [
      language,
      selectedIllnesses,
      primaryIllness,
      selectedMedications,
      medicationCatalog,
      reminders,
      mealReminders,
      metricLogs,
      medicationHistory,
      mealHistory,
      medicationChecklist,
      mealChecklist,
      medicationTotal,
      medicationTaken,
      user,
      profileComplete,
      accessibility,
      textScale,
      isReady
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
