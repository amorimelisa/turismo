import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const mensagem = 'Olá, seja bem-vindo ao vooa!';

export default function WelcomeScreen({ onComplete }) {
  useEffect(() => {
    const temporizadorConclusao = setTimeout(onComplete, 1400);
    return () => clearTimeout(temporizadorConclusao);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <View style={styles.mensagemContainer}>
        <Text accessibilityLabel={mensagem} style={styles.mensagem}>
          {mensagem}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  mensagemContainer: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  mensagem: {
    color: '#858585',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
});
