import React, { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { scale, scaledFont } from '../theme';

const mealColors = {
  breakfast: '#3F2F1F',
  lunch: '#214034',
  dinner: '#253A4D'
};

export default function DietPlansScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const { language, textScale, getDietPlan, mealChecklist, toggleMealTaken } = useApp();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t(language, 'dietPlans') });
  }, [navigation, language]);

  const plan = getDietPlan(language);
  const meals = plan?.meals || {};

  return (
    <LinearGradient colors={['#2D2418', '#1F3323']} style={styles.wrap}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + scale(20) }]}>
          <Text style={[styles.title, { fontSize: scaledFont(30, textScale) }]}>{t(language, 'dietPlans')}</Text>
          <Text style={styles.subtitle}>{plan?.subtitle || t(language, 'noDiet')}</Text>

          <View style={styles.tagRow}>
            {(plan?.tags || []).map((tag, idx) => (
              <View key={`${tag}_${idx}`} style={[styles.tag, idx === 0 && styles.tagPrimary]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {['breakfast', 'lunch', 'dinner'].map((mealKey) => {
            const meal = meals[mealKey];
            if (!meal) return null;
            return (
              <View key={mealKey} style={[styles.mealCard, { backgroundColor: mealColors[mealKey] }]}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>{meal.title || t(language, mealKey)}</Text>
                  <Pressable onPress={() => toggleMealTaken(mealKey)}>
                    <Ionicons
                      name={mealChecklist?.[mealKey] ? 'checkmark-circle' : 'ellipse-outline'}
                      size={scale(22)}
                      color={mealChecklist?.[mealKey] ? '#6CCB4F' : '#EAF6FF'}
                    />
                  </Pressable>
                </View>
                <Text style={styles.mealDescription}>{meal.description}</Text>
                <Text style={styles.mealMeta}>{meal.meta}</Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  safe: { flex: 1 },
  container: { padding: scale(16), paddingBottom: scale(20) },
  title: { color: '#FFF4DE', fontWeight: '800' },
  subtitle: { color: '#F2DDBA', marginTop: scale(6), marginBottom: scale(12) },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(8), marginBottom: scale(10) },
  tag: {
    backgroundColor: '#4E3C24',
    borderRadius: scale(18),
    paddingVertical: scale(8),
    paddingHorizontal: scale(12)
  },
  tagPrimary: { backgroundColor: '#0E9FBE' },
  tagText: { color: '#FFECCC', fontWeight: '700', fontSize: scale(12) },
  mealCard: {
    borderRadius: scale(16),
    padding: scale(14),
    marginBottom: scale(10)
  },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealTitle: { color: '#FFF0D4', fontSize: scale(20), fontWeight: '800' },
  mealDescription: { marginTop: scale(8), color: '#F5DCB3', fontSize: scale(16) },
  mealMeta: { marginTop: scale(6), color: '#E9C891', fontSize: scale(14) }
});
