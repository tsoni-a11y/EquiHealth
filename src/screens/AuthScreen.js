import React, { useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { gradients, scale } from '../theme';

export default function AuthScreen({ navigation }) {
  const { language, saveUserAuth } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'authTitle') });
  }, [navigation, language]);

  const onContinue = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(t(language, 'authError'));
      return;
    }

    await saveUserAuth({
      name: name.trim(),
      phone: phone.trim()
    });
    navigation.replace('ProfileSetup');
  };

  return (
    <LinearGradient colors={gradients.splash} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{t(language, 'authTitle')}</Text>
        <Text style={styles.subHeading}>{t(language, 'authSubtitle')}</Text>

        <Text style={styles.label}>{t(language, 'fullName')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t(language, 'fullName')} placeholderTextColor="#A9C3CF" />

        <Text style={styles.label}>{t(language, 'phoneNumber')}</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder={t(language, 'phoneNumber')}
          placeholderTextColor="#A9C3CF"
          keyboardType="phone-pad"
        />

        <Pressable style={styles.cta} onPress={onContinue}>
          <Text style={styles.ctaText}>{t(language, 'continue')}</Text>
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
  heading: { fontSize: scale(30), fontWeight: '800', color: '#F4FBFF' },
  subHeading: { marginTop: scale(8), marginBottom: scale(18), color: '#C9EAF3' },
  label: { marginBottom: scale(6), fontWeight: '700', color: '#EAF8FF' },
  input: {
    backgroundColor: 'rgba(19,42,54,0.86)',
    color: '#fff',
    borderColor: '#2B4C5F',
    borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: scale(12)
  },
  cta: {
    marginTop: scale(10),
    backgroundColor: '#0e9fbe',
    borderRadius: scale(12),
    paddingVertical: scale(12),
    alignItems: 'center'
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: scale(16) }
});
