import React, { useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { gradients, scale } from '../theme';

export default function ProfileSetupScreen({ navigation }) {
  const { language, completeProfileSetup } = useApp();
  const [age, setAge] = useState('');
  const [largeText, setLargeText] = useState(true);
  const [voiceAssist] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'profileSetupTitle') });
  }, [navigation, language]);

  const onFinish = async () => {
    await completeProfileSetup({
      age: age.trim(),
      largeText,
      voiceAssist
    });
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }]
    });
  };

  return (
    <LinearGradient colors={gradients.conditions} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{t(language, 'profileSetupTitle')}</Text>
        <Text style={styles.subHeading}>{t(language, 'profileSetupSubtitle')}</Text>

        <Text style={styles.label}>{t(language, 'age')}</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder={t(language, 'age')}
          placeholderTextColor="#A9C3CF"
          keyboardType="number-pad"
        />

        <View style={styles.row}>
          <Text style={styles.switchLabel}>{t(language, 'largeText')}</Text>
          <Switch value={largeText} onValueChange={setLargeText} />
        </View>

        <View style={styles.row}>
          <Text style={styles.switchLabel}>{t(language, 'voiceAssist')}</Text>
          <Switch
            value={voiceAssist}
            onValueChange={() => Alert.alert(t(language, 'voiceComingSoon'))}
            disabled
          />
        </View>

        <Pressable style={styles.cta} onPress={onFinish}>
          <Text style={styles.ctaText}>{t(language, 'finishSetup')}</Text>
        </Pressable>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: scale(20) },
  heading: { fontSize: scale(26), fontWeight: '800', color: '#F3F5FF' },
  subHeading: { marginTop: scale(8), marginBottom: scale(18), color: '#BFC9E2' },
  label: { marginBottom: scale(6), fontWeight: '700', color: '#DCE5FF' },
  input: {
    backgroundColor: '#21314F',
    color: '#F0F4FF',
    borderColor: '#3A547A',
    borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: scale(16)
  },
  row: {
    backgroundColor: '#1C3A50',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#3A547A',
    padding: scale(12),
    marginBottom: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchLabel: { fontSize: scale(15), fontWeight: '700', color: '#EAF8FF' },
  cta: {
    marginTop: scale(12),
    backgroundColor: '#0e9fbe',
    borderRadius: scale(12),
    paddingVertical: scale(12),
    alignItems: 'center'
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: scale(16) }
});
