import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { gradients, scale } from '../theme';

const OTP_LENGTH = 6;

export default function OtpVerificationScreen({ navigation, route }) {
  const { language, otpExpiry: otpExpiryTimestamp, sendOtp, verifyOtp, saveUserAuth } = useApp();
  const [code, setCode] = useState('');
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState('');

  const name = route.params?.name?.trim() || '';
  const phone = route.params?.phone?.trim() || '';

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'verifyCode') });
  }, [navigation, language]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const remainingMs = useMemo(() => Math.max(0, (otpExpiryTimestamp || 0) - now), [otpExpiryTimestamp, now]);
  const isExpired = remainingMs <= 0;
  const timeText = isExpired
    ? ''
    : `${String(Math.floor(remainingMs / 60000)).padStart(2, '0')}:${String(
        Math.floor((remainingMs % 60000) / 1000)
      ).padStart(2, '0')}`;

  const onVerify = async () => {
    if (code.length < OTP_LENGTH) {
      setError(t(language, 'otpIncomplete'));
      return;
    }

    const result = verifyOtp(code);
    if (!result.success) {
      setError(t(language, result.reason === 'expired' ? 'otpExpired' : 'otpInvalid'));
      return;
    }

    await saveUserAuth({ name, phone });
    navigation.replace('ProfileSetup');
  };

  const onResend = () => {
    if (!phone) {
      Alert.alert(t(language, 'otpResendUnavailable'));
      return;
    }

    setCode('');
    setError('');
    sendOtp(phone);
  };

  return (
    <LinearGradient colors={gradients.splash} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>{t(language, 'verifyCode')}</Text>
          <Text style={styles.subHeading}>{t(language, 'otpSent')}</Text>

          <Text style={styles.label}>{t(language, 'enterCode')}</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={(value) => {
              setError('');
              setCode(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
            }}
            placeholder={t(language, 'enterCode')}
            placeholderTextColor="#A9C3CF"
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
          />

          <Text style={styles.timerLabel}>
            {isExpired ? t(language, 'otpExpired') : `${t(language, 'otpTimeLeft')}: ${timeText}`}
          </Text>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={styles.cta}
            onPress={onVerify}
            accessibilityRole="button"
            accessibilityLabel={t(language, 'verify')}
            accessibilityHint={t(language, 'verifyCodeHint')}
          >
            <Text style={styles.ctaText}>{t(language, 'verify')}</Text>
          </Pressable>

          {isExpired ? (
            <Pressable
              style={styles.resend}
              onPress={onResend}
              accessibilityRole="button"
              accessibilityLabel={t(language, 'resendCode')}
              accessibilityHint={t(language, 'resendCodeHint')}
            >
              <Text style={styles.resendText}>{t(language, 'resendCode')}</Text>
            </Pressable>
          ) : null}
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
    marginBottom: scale(12),
    letterSpacing: scale(3)
  },
  timerLabel: { color: '#C9EAF3', marginBottom: scale(10) },
  errorText: { color: '#FFD6D6', marginBottom: scale(10), fontWeight: '700' },
  cta: {
    marginTop: scale(10),
    backgroundColor: '#0e9fbe',
    borderRadius: scale(12),
    paddingVertical: scale(12),
    alignItems: 'center'
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: scale(16) },
  resend: { marginTop: scale(12), alignItems: 'center' },
  resendText: { color: '#C9EAF3', textDecorationLine: 'underline', fontWeight: '700' }
});
