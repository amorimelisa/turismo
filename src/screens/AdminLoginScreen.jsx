import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { loginAdmin } from '@/services/auth';

export default function AdminLoginScreen() {
  const { iniciarSessao } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar() {
    setErro('');
    setEnviando(true);
    try {
      const session = await loginAdmin(email.trim(), senha);
      await iniciarSessao(session);
      router.replace('/admin');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>ÁREA RESTRITA</Text>
        <Text style={styles.title}>Acesso administrativo</Text>
        <Text style={styles.description}>
          Entre com uma conta de administrador provisionada pela equipe.
        </Text>

        <Text style={styles.label}>E-mail administrativo</Text>
        <TextInput
          accessibilityLabel="E-mail administrativo"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="admin@vooa.com"
          style={styles.input}
          value={email}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          accessibilityLabel="Senha do administrador"
          autoCapitalize="none"
          onChangeText={setSenha}
          onSubmitEditing={entrar}
          placeholder="Sua senha"
          secureTextEntry
          style={styles.input}
          value={senha}
        />

        {erro ? <Text accessibilityRole="alert" style={styles.error}>{erro}</Text> : null}

        <Pressable
          accessibilityRole="button"
          disabled={enviando || !email.trim() || !senha}
          onPress={entrar}
          style={[styles.button, (enviando || !email.trim() || !senha) && styles.buttonDisabled]}
        >
          {enviando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar como administrador</Text>
          )}
        </Pressable>

        <Link href="/" style={styles.clientLink}>
          Voltar ao login de cliente
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', backgroundColor: '#F4F7FA', padding: 20 },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center', padding: 28, borderRadius: 20, backgroundColor: '#FFFFFF', gap: 12, elevation: 3 },
  eyebrow: { color: '#4BAFB3', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: '#303B59', fontSize: 26, fontWeight: '800' },
  description: { marginBottom: 8, color: '#667085', fontSize: 14, lineHeight: 21 },
  label: { color: '#303B59', fontSize: 13, fontWeight: '700' },
  input: { minHeight: 48, paddingHorizontal: 14, borderWidth: 1, borderColor: '#D5DCE5', borderRadius: 10, color: '#303B59' },
  error: { color: '#B42318', fontSize: 13, lineHeight: 19 },
  button: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 6, borderRadius: 10, backgroundColor: '#303B59' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  clientLink: { alignSelf: 'center', marginTop: 6, color: '#4BAFB3', fontSize: 13, fontWeight: '700' },
});
