
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { VooaColors } from "@/constants/theme";

export default function DiarioInicioScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width <= 480;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.content,
          isCompact && styles.compactContent,
        ]}
      >
        {/* Apresentação principal */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            VIAJE NO SEU RITMO
          </Text>

          <Text
            style={[
              styles.title,
              isCompact && styles.compactTitle,
            ]}
          >
            O mundo espera por você.
          </Text>

          <Text
            style={[
              styles.description,
              isCompact && styles.compactDescription,
            ]}
          >
            Descubra novos caminhos, viva cada momento e
            guarde histórias que merecem ser lembradas.
          </Text>

          <Link href="/explore" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                Explorar viagens
              </Text>
              <Text style={styles.buttonArrow}>→</Text>
            </Pressable>
          </Link>

          <Link href="/conta" asChild>
            <Pressable style={styles.accountButton}>
              <Text style={styles.accountButtonText}>Entrar ou criar conta</Text>
            </Pressable>
          </Link>
        </View>

        {/* Cartão do diário */}
        <View
          style={[
            styles.journalCard,
            isCompact && styles.compactJournalCard,
          ]}
        >
          <Text style={styles.cardEyebrow}>
            SEU DIÁRIO DE VIAGENS
          </Text>

          <Text
            style={[
              styles.cardTitle,
              isCompact && styles.compactCardTitle,
            ]}
          >
            Cada viagem merece ser lembrada.
          </Text>

          <Text style={styles.cardDescription}>
            Reencontre os momentos especiais da sua
            jornada.
          </Text>

          <Link href="/diario" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Abrir Diário
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: VooaColors.white,
  },

  scrollContent: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
  },

  content: {
    width: "100%",
    maxWidth: 640,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 100,
    gap: 32,
  },

  compactContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 26,
  },

  hero: {
    width: "100%",
    minWidth: 0,
    alignItems: "flex-start",
    gap: 14,
  },

  eyebrow: {
    width: "100%",
    color: VooaColors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
    flexShrink: 1,
  },

  title: {
    width: "100%",
    minWidth: 0,
    color: VooaColors.navy,
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 48,
    flexShrink: 1,
  },

  compactTitle: {
    fontSize: 29,
    lineHeight: 36,
  },

  description: {
    width: "100%",
    color: VooaColors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    flexShrink: 1,
  },

  compactDescription: {
    fontSize: 14,
    lineHeight: 22,
  },

  primaryButton: {
    minHeight: 48,
    maxWidth: "100%",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 28,
    backgroundColor: VooaColors.navy,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  primaryButtonText: {
    color: VooaColors.white,
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },

  buttonArrow: {
    color: VooaColors.white,
    fontSize: 18,
  },

  accountButton: {
    minHeight: 44,
    maxWidth: "100%",
    paddingHorizontal: 4,
    paddingVertical: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  accountButtonText: {
    color: VooaColors.navy,
    fontSize: 13,
    fontWeight: "700",
  },

  journalCard: {
    width: "100%",
    minWidth: 0,
    padding: 24,
    borderRadius: 20,
    backgroundColor: VooaColors.cream,
    gap: 12,
  },

  compactJournalCard: {
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },

  cardEyebrow: {
    color: VooaColors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    flexShrink: 1,
  },

  cardTitle: {
    width: "100%",
    color: VooaColors.navy,
    fontSize: 21,
    fontWeight: "600",
    lineHeight: 28,
    flexShrink: 1,
  },

  compactCardTitle: {
    fontSize: 19,
    lineHeight: 26,
  },

  cardDescription: {
    width: "100%",
    color: VooaColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    flexShrink: 1,
  },

  secondaryButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginTop: 4,
  },

  secondaryButtonText: {
    color: VooaColors.navy,
    fontSize: 14,
    fontWeight: "600",
  },
});
