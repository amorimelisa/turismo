
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PhotoBook from "@/components/PhotoBook";
import AvaliacoesViagem from "@/components/AvaliacoesViagem";

export default function Diario() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.cabecalho}>
        <View style={styles.detalheSuperior}>
          <View style={styles.linha} />
          <Text style={styles.etiqueta}>
            VOOA · TRAVEL MEMORIES
          </Text>
          <View style={styles.linha} />
        </View>

        <Text style={styles.titulo}>
          Diário
        </Text>

        <Text style={styles.subtitulo}>
          Cada viagem guarda uma história.
          {"\n"}
          Reviva seus momentos favoritos.
        </Text>

        <View style={styles.detalheInferior} />
      </View>

      <View style={styles.secaoLivro}>
        <PhotoBook />
      </View>

      <View style={styles.secaoAvaliacoes}>
        <AvaliacoesViagem />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303B59",
  },

  conteudo: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 50,
  },

  cabecalho: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginBottom: 32,
  },

  detalheSuperior: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 17,
  },

  linha: {
    width: 28,
    height: 1,
    backgroundColor: "#4BAFB3",
  },

  etiqueta: {
    color: "#B8D5CD",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 43,
    fontWeight: "600",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  subtitulo: {
    color: "#D5D9E3",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
    maxWidth: 400,
    marginTop: 12,
  },

  detalheInferior: {
    width: 42,
    height: 2,
    backgroundColor: "#4BAFB3",
    marginTop: 21,
    borderRadius: 3,
  },

  secaoLivro: {
    width: "100%",
    alignItems: "center",
  },

  secaoAvaliacoes: {
    width: "100%",
    marginTop: 28,
  },
});
