import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { colors, spacing, type } from '../theme';
import { Button, Card, FieldLabel, Input, Screen } from '../components/ui';

export default function ProfileSetupScreen({ navigation }) {
  const { language, completeProfileSetup, textScale } = useApp();
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
    <Screen title={t(language, 'profileSetupTitle')} subtitle={t(language, 'profileSetupSubtitle')} textScale={textScale}>
      <FieldLabel>{t(language, 'age')}</FieldLabel>
      <Input value={age} onChangeText={setAge} placeholder={t(language, 'age')} keyboardType="number-pad" />

      <Card tone="plain" style={styles.toggles}>
        <View style={styles.row}>
          <Text style={[type.bodyStrong, styles.rowLabel]}>{t(language, 'largeText')}</Text>
          <Switch
            value={largeText}
            onValueChange={setLargeText}
            trackColor={{ true: colors.green, false: colors.borderStrong }}
            accessibilityLabel={t(language, 'largeText')}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.rowLabel}>
            <Text style={[type.bodyStrong, { color: colors.textMuted }]}>{t(language, 'voiceAssist')}</Text>
            <Text style={type.label}>{t(language, 'voiceComingSoon')}</Text>
          </View>
          <Switch value={voiceAssist} onValueChange={() => Alert.alert(t(language, 'voiceComingSoon'))} disabled />
        </View>
      </Card>

      <Button label={t(language, 'finishSetup')} icon="checkmark" variant="green" onPress={onFinish} style={{ marginTop: spacing.sm }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggles: { paddingVertical: spacing.sm, marginTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, gap: spacing.md },
  rowLabel: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.border }
});
