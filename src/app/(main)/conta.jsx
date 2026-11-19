import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function ContaScreen() {
  const { usuario, restaurandoSessao, encerrarSessao } = useAuth();
  const [saindo, setSaindo] = useState(false);

  if (restaurandoSessao) return <ActivityIndicator style={styles.loading} color="#4BAFB3" />;
  if (!usuario) return <Redirect href="/" />;

  async function sair() {
    setSaindo(true);
    try {
      await encerrarSessao();
    } catch (error) {
      console.error('Não foi possível encerrar a sessão:', error);
      Alert.alert('Aviso', 'Não foi possível encerrar sua sessão.');
      setSaindo(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>SUA CONTA</Text>
      <Text style={styles.title}>{usuario.name}</Text>
      <Text style={styles.email}>{usuario.email}</Text>
      <Text style={styles.role}>
        {usuario.role === 'admin' ? 'Administrador' : 'Cliente'}
      </Text>
      <Pressable
        accessibilityRole="button"
        disabled={saindo}
        onPress={sair}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {saindo ? 'Saindo...' : 'Sair da conta'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignSelf: 'center' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  eyebrow: { color: '#4BAFB3', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  title: { marginTop: 12, color: '#303B59', fontSize: 28, fontWeight: '700' },
  email: { marginTop: 8, color: '#58647B', fontSize: 16 },
  role: { marginTop: 6, color: '#58647B', fontSize: 14 },
  button: { marginTop: 28, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, backgroundColor: '#303B59' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
