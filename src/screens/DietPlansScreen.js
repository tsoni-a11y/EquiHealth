import React, { useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { colors, fonts, radius, scale, spacing, type } from '../theme';
import { Card, Screen } from '../components/ui';

const mealIcons = {
  breakfast: 'sunny-outline',
  lunch: 'restaurant-outline',
  dinner: 'moon-outline'
};

export default function DietPlansScreen({ navigation }) {
  const { language, textScale, getDietPlan, mealChecklist, toggleMealTaken } = useApp();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'dietPlans') });
  }, [navigation, language]);

  const plan = getDietPlan(language);
  const meals = plan?.meals || {};

  return (
    <Screen safeTop title={t(language, 'dietPlans')} subtitle={plan?.subtitle || t(language, 'noDiet')} textScale={textScale}>
      {(plan?.tags || []).length ? (
        <View style={styles.tagRow}>
          {plan.tags.map((tag, idx) => (
            <View key={`${tag}_${idx}`} style={[styles.tag, idx === 0 && styles.tagPrimary]}>
              <Text style={[styles.tagText, idx === 0 && { color: colors.greenText }]}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {['breakfast', 'lunch', 'dinner'].map((mealKey) => {
        const meal = meals[mealKey];
        if (!meal) return null;
        const done = !!mealChecklist?.[mealKey];
        return (
          <Card key={mealKey} tone="plain">
            <View style={styles.mealHeader}>
              <View style={styles.mealIcon}>
                <Ionicons name={mealIcons[mealKey]} size={scale(20)} color={colors.blueText} />
              </View>
              <Text style={[type.heading, { flex: 1 }]}>{meal.title || t(language, mealKey)}</Text>
              <Pressable
                onPress={() => toggleMealTaken(mealKey)}
                hitSlop={12}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: done }}
                accessibilityLabel={t(language, mealKey)}
              >
                <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={scale(30)} color={done ? colors.green : colors.borderStrong} />
              </Pressable>
            </View>
            <Text style={[type.body, styles.mealDescription]}>{meal.description}</Text>
            {meal.meta ? <Text style={type.muted}>{meal.meta}</Text> : null}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md
  },
  tagPrimary: { backgroundColor: colors.greenSoft },
  tagText: { fontFamily: fonts.medium, fontSize: scale(13), color: colors.textMuted },
  mealHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  mealIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: radius.sm,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mealDescription: { marginTop: spacing.md, marginBottom: spacing.xs }
});
