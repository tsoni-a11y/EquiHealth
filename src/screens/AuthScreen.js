import React, { useLayoutEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { Button, FieldLabel, Input, Screen } from '../components/ui';

export default function AuthScreen({ navigation }) {
  const { language, saveUserAuth, textScale } = useApp();
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
    <Screen title={t(language, 'authTitle')} subtitle={t(language, 'authSubtitle')} textScale={textScale}>
      <FieldLabel>{t(language, 'fullName')}</FieldLabel>
      <Input value={name} onChangeText={setName} placeholder={t(language, 'fullName')} autoComplete="name" textContentType="name" />

      <FieldLabel>{t(language, 'phoneNumber')}</FieldLabel>
      <Input
        value={phone}
        onChangeText={setPhone}
        placeholder={t(language, 'phoneNumber')}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
      />

      <Button label={t(language, 'continue')} icon="arrow-forward" onPress={onContinue} style={{ marginTop: 8 }} />
    </Screen>
  );
}
