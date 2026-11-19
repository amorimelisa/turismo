import { Link } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import ViagensComunidade from '@/components/ViagensComunidade';
import { VooaColors } from '@/constants/theme';

export default function ExploreScreen() {
  const isCompact = useWindowDimensions().width <= 480;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        isCompact && styles.compactContent,
      ]}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>NOVOS CAMINHOS</Text>
      <Text style={[styles.title, isCompact && styles.compactTitle]}>
        Explore o mundo.
      </Text>
      <Text style={[styles.description, isCompact && styles.compactDescription]}>
        Toda grande viagem começa com uma ideia. Deixe a curiosidade escolher o
        próximo caminho.
      </Text>

      <View style={[styles.featureCard, isCompact && styles.compactFeatureCard]}>
        <Text style={styles.cardEyebrow}>VOOA</Text>
        <Text style={[styles.cardTitle, isCompact && styles.compactCardTitle]}>
          Sua próxima história começa aqui.
        </Text>
        <Text style={styles.cardDescription}>
          Inspire-se para viajar e guarde no Diário as lembranças que tornam
          cada jornada única.
        </Text>
        <Link href="/diario" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Conhecer meu Diário</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>
        </Link>
        <Link href="/historias" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Abrir diário coletivo</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>
        </Link>
      </View>

      <ViagensComunidade />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: VooaColors.white,
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 120,
    gap: 18,
  },
  compactContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 36,
    gap: 12,
  },
  eyebrow: {
    color: VooaColors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
  },
  title: {
    color: VooaColors.navy,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 43,
  },
  compactTitle: {
    fontSize: 30,
    lineHeight: 36,
  },
  description: {
    color: VooaColors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
  },
  compactDescription: {
    fontSize: 14,
    lineHeight: 21,
  },
  featureCard: {
    marginTop: 16,
    padding: 24,
    borderRadius: 20,
    gap: 14,
    backgroundColor: VooaColors.cream,
  },
  compactFeatureCard: {
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    gap: 10,
  },
  cardEyebrow: {
    color: VooaColors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  cardTitle: {
    color: VooaColors.navy,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 31,
  },
  compactCardTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  cardDescription: {
    color: VooaColors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  button: {
    minHeight: 48,
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 18,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: VooaColors.navy,
  },
  buttonText: {
    color: VooaColors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  buttonArrow: {
    color: VooaColors.white,
    fontSize: 17,
  },
});
