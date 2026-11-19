import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import {
  deleteAdminStory,
  listAdminStories,
  listAdminUsers,
  setAdminUserActive,
} from '@/services/auth';

async function fetchAdminData(token) {
  const [users, stories] = await Promise.all([
    listAdminUsers(token),
    listAdminStories(token),
  ]);
  return { users, stories };
}

export default function AdminDashboardScreen() {
  const { usuario, restaurandoSessao, encerrarSessao } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [historias, setHistorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [acaoId, setAcaoId] = useState(null);
  const token = usuario?.accessToken;

  const carregarPainel = useCallback(async () => {
    if (!token) return;
    setCarregando(true);
    setErro('');
    try {
      const data = await fetchAdminData(token);
      setUsuarios(data.users);
      setHistorias(data.stories);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível carregar o painel.');
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    if (restaurandoSessao || usuario?.role !== 'admin' || !token) return undefined;
    let active = true;

    fetchAdminData(token)
      .then((data) => {
        if (!active) return;
        setErro('');
        setUsuarios(data.users);
        setHistorias(data.stories);
      })
      .catch((error) => {
        if (!active) return;
        setErro(
          error instanceof Error ? error.message : 'Não foi possível carregar o painel.'
        );
      })
      .finally(() => {
        if (active) setCarregando(false);
      });

    return () => {
      active = false;
    };
  }, [restaurandoSessao, token, usuario?.role]);

  if (restaurandoSessao) {
    return <ActivityIndicator color="#4BAFB3" style={styles.loading} />;
  }
  if (usuario?.role !== 'admin' || !token) {
    return <Redirect href="/admin-login" />;
  }

  async function alterarStatus(user) {
    setAcaoId(`user-${user.id}`);
    setErro('');
    try {
      await setAdminUserActive(user.id, !user.active, token);
      setUsuarios((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, active: !user.active } : item
        )
      );
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível atualizar o cliente.');
    } finally {
      setAcaoId(null);
    }
  }

  function confirmarExclusao(story) {
    Alert.alert('Remover história?', `“${story.title}” deixará de aparecer para todos.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => removerHistoria(story.id),
      },
    ]);
  }

  async function removerHistoria(storyId) {
    setAcaoId(`story-${storyId}`);
    setErro('');
    try {
      await deleteAdminStory(storyId, token);
      setHistorias((current) => current.filter((story) => story.id !== storyId));
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível remover a história.');
    } finally {
      setAcaoId(null);
    }
  }

  async function sair() {
    try {
      await encerrarSessao();
      router.replace('/admin-login');
    } catch (error) {
      console.error('Não foi possível encerrar a sessão administrativa:', error);
      setErro('Não foi possível encerrar a sessão. Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>VOOA · ADMIN</Text>
            <Text style={styles.title}>Painel de administração</Text>
            <Text style={styles.subtitle}>Olá, {usuario.name}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={sair} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard label="Clientes" value={usuarios.length} />
          <SummaryCard label="Histórias" value={historias.length} />
        </View>

        {erro ? <Text accessibilityRole="alert" style={styles.error}>{erro}</Text> : null}

        {carregando ? (
          <ActivityIndicator color="#4BAFB3" style={styles.loading} />
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Clientes</Text>
              <Pressable accessibilityRole="button" onPress={carregarPainel}>
                <FontAwesome name="refresh" size={18} color="#303B59" />
              </Pressable>
            </View>
            {usuarios.length === 0 ? (
              <Text style={styles.empty}>Ainda não há clientes cadastrados.</Text>
            ) : usuarios.map((user) => (
              <View key={user.id} style={styles.card}>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{user.name}</Text>
                  <Text style={styles.cardDetail}>{user.email}</Text>
                  <Text style={styles.cardStatus}>
                    {user.active ? 'Conta ativa' : 'Conta bloqueada'}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  disabled={acaoId === `user-${user.id}`}
                  onPress={() => alterarStatus(user)}
                  style={[styles.smallButton, !user.active && styles.activateButton]}
                >
                  <Text style={styles.smallButtonText}>
                    {acaoId === `user-${user.id}` ? '...' : user.active ? 'Bloquear' : 'Ativar'}
                  </Text>
                </Pressable>
              </View>
            ))}

            <Text style={[styles.sectionTitle, styles.storiesTitle]}>Histórias publicadas</Text>
            {historias.length === 0 ? (
              <Text style={styles.empty}>Ainda não há histórias publicadas por clientes.</Text>
            ) : historias.map((story) => (
              <View key={story.id} style={styles.card}>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{story.title}</Text>
                  <Text style={styles.cardDetail}>{story.destination} · {story.country}</Text>
                  <Text style={styles.cardDetail}>{story.author} ({story.authorEmail})</Text>
                  <Text numberOfLines={3} style={styles.storyText}>{story.story}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remover história ${story.title}`}
                  disabled={acaoId === `story-${story.id}`}
                  onPress={() => confirmarExclusao(story)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>
                    {acaoId === `story-${story.id}` ? '...' : 'Remover'}
                  </Text>
                </Pressable>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({ label, value }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7FA' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: 20, paddingBottom: 40, gap: 14 },
  loading: { flex: 1, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 8 },
  headerCopy: { flex: 1 },
  eyebrow: { color: '#4BAFB3', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { marginTop: 6, color: '#303B59', fontSize: 25, fontWeight: '800' },
  subtitle: { marginTop: 5, color: '#667085', fontSize: 14 },
  logoutButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#303B59' },
  logoutText: { color: '#FFFFFF', fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, padding: 18, borderRadius: 14, backgroundColor: '#FFFFFF' },
  summaryValue: { color: '#303B59', fontSize: 24, fontWeight: '800' },
  summaryLabel: { marginTop: 4, color: '#667085', fontSize: 13 },
  error: { padding: 12, borderRadius: 10, backgroundColor: '#FEE4E2', color: '#B42318', fontSize: 13 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  sectionTitle: { color: '#303B59', fontSize: 19, fontWeight: '800' },
  storiesTitle: { marginTop: 16 },
  empty: { padding: 18, borderRadius: 12, backgroundColor: '#FFFFFF', color: '#667085', fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, backgroundColor: '#FFFFFF' },
  cardCopy: { flex: 1, gap: 4 },
  cardTitle: { color: '#303B59', fontSize: 15, fontWeight: '700' },
  cardDetail: { color: '#667085', fontSize: 12 },
  cardStatus: { color: '#4BAFB3', fontSize: 12, fontWeight: '700' },
  storyText: { marginTop: 5, color: '#475467', fontSize: 13, lineHeight: 18 },
  smallButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 8, backgroundColor: '#FEE4E2' },
  activateButton: { backgroundColor: '#D1FADF' },
  smallButtonText: { color: '#303B59', fontSize: 12, fontWeight: '700' },
  deleteButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 8, backgroundColor: '#FEE4E2' },
  deleteText: { color: '#B42318', fontSize: 12, fontWeight: '700' },
});
