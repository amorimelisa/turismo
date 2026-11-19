import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RouteTabBar from '../components/RouteTabBar';

const destinos = [
  {
    nome: 'Hayden Park',
    pais: 'United Kingdom',
    categoria: 'Aventuras',
    nota: '4.5',
    avaliacoes: '113k avaliações',
    cor: '#DDECF6',
  },
  {
    nome: 'Blue Mountain',
    pais: 'Canadá',
    categoria: 'Aventuras',
    nota: '4.8',
    avaliacoes: '86k avaliações',
    cor: '#D5E8F4',
  },
  {
    nome: 'Lago di Como',
    pais: 'Itália',
    categoria: 'Relaxamento',
    nota: '4.7',
    avaliacoes: '92k avaliações',
    cor: '#C9E0F0',
  },
  {
    nome: 'Serra da Capivara',
    pais: 'Brasil',
    categoria: 'Culturais',
    nota: '4.9',
    avaliacoes: '54k avaliações',
    cor: '#BBD8EC',
  },
];

const categorias = ['voos', 'hoteis', 'diario de viagem', 'ofertas'];
const CARD_SIDE_PEEK = 36;

function CardDestino({ destino, style, ativo, favorito, onToggleFavorito }) {
  return (
    <Animated.View style={[styles.card, style]}>
      <View style={[styles.cardSurface, { backgroundColor: destino.cor }]}>
        {ativo ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            accessibilityState={{ selected: favorito }}
            onPress={onToggleFavorito}
            style={styles.favoriteButton}
            activeOpacity={0.8}
          >
            <FontAwesome
              name={favorito ? 'heart' : 'heart-o'}
              size={26}
              color={favorito ? '#EF624C' : '#EF624C'}
            />
          </TouchableOpacity>
        ) : null}

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{destino.nome},</Text>
          <Text style={styles.cardCountry}>{destino.pais}</Text>
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={17} color="#F6B936" />
            <Text style={styles.rating}>{destino.nota}</Text>
            <Text style={styles.reviews}>({destino.avaliacoes})</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function HomeContent({ usuario }) {
  const { width } = useWindowDimensions();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('voos');
  const [indice, setIndice] = useState(0);
  const [favoritos, setFavoritos] = useState({});
  const [animando, setAnimando] = useState(false);
  const progresso = useRef(new Animated.Value(0)).current;

  const cardWidth = Math.min(width - 126, 264);
  const destinoAtual = destinos[indice];

  const slots = {
    active: { x: 0, y: 0, scale: 1, rotate: '0deg', z: 4 },
    right: { x: CARD_SIDE_PEEK, y: 18, scale: 0.82, rotate: '7deg', z: 3 },
    left: { x: -CARD_SIDE_PEEK, y: 18, scale: 0.82, rotate: '-7deg', z: 2 },
    back: { x: 0, y: 0, scale: 0.72, rotate: '0deg', z: 1 },
  };

  const nextSlot = { active: 'left', right: 'active', left: 'back', back: 'right' };

  function papelDoCard(cardIndex) {
    const distancia = (cardIndex - indice + destinos.length) % destinos.length;
    if (distancia === 0) return 'active';
    if (distancia === 1) return 'right';
    if (distancia === destinos.length - 1) return 'left';
    return 'back';
  }

  function estiloAnimadoDoCard(papel) {
    const inicio = slots[papel];
    const fim = slots[nextSlot[papel]];
    const interpolar = (propriedade) =>
      progresso.interpolate({
        inputRange: [0, 1],
        outputRange: [inicio[propriedade], fim[propriedade]],
      });
    const zIndex = progresso.interpolate({
      inputRange: [0, 0.48, 0.52, 1],
      outputRange: [inicio.z, inicio.z, fim.z, fim.z],
    });

    return {
      left: CARD_SIDE_PEEK,
      width: cardWidth,
      zIndex,
      transform: [
        { translateX: interpolar('x') },
        { translateY: interpolar('y') },
        { scale: interpolar('scale') },
        { rotate: interpolar('rotate') },
      ],
    };
  }

  function avancar() {
    if (animando) return;
    setAnimando(true);
    Animated.timing(progresso, {
      toValue: 1,
      duration: 700,
      easing: Easing.bezier(0.22, 0.75, 0.2, 1),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      progresso.setValue(0);
      setIndice((valor) => (valor + 1) % destinos.length);
      setAnimando(false);
    });
  }

  function alternarFavorito() {
    setFavoritos((atuais) => ({
      ...atuais,
      [destinoAtual.nome]: !atuais[destinoAtual.nome],
    }));
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar} />
        <View style={styles.welcomeCopy}>
          <Text style={styles.welcomeLabel}>Planeje sua viagem</Text>
          <Text style={styles.userName}>{usuario.name}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} accessibilityLabel="Notificações">
          <FontAwesome name="bell-o" size={23} color="#6D7074" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <FontAwesome name="search" size={24} color="#7C7F83" />
        <Text style={styles.searchPlaceholder}>Where do you want to go?</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categorias.map((categoria) => {
          const selecionada = categoria === categoriaSelecionada;
          return (
            <TouchableOpacity
              key={categoria}
              onPress={() => setCategoriaSelecionada(categoria)}
              style={[styles.category, selecionada && styles.categorySelected]}
              activeOpacity={0.82}
            >
              <Text style={[styles.categoryText, selecionada && styles.categoryTextSelected]}>
                {categoria}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>Destaques</Text>

      <View style={[styles.deck, { width: cardWidth + CARD_SIDE_PEEK * 2, height: 380 }]}>
        {destinos.map((destino, cardIndex) => {
          const papel = papelDoCard(cardIndex);
          return (
            <CardDestino
              key={destino.nome}
              destino={destino}
              ativo={papel === 'active'}
              favorito={papel === 'active' && Boolean(favoritos[destino.nome])}
              onToggleFavorito={papel === 'active' ? alternarFavorito : undefined}
              style={[styles.card, estiloAnimadoDoCard(papel)]}
            />
          );
        })}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Próximo destino"
          onPress={avancar}
          disabled={animando}
          style={[styles.nextButton, { right: CARD_SIDE_PEEK + 13 }]}
          activeOpacity={0.8}
        >
          <FontAwesome name="arrow-right" size={25} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.experiences}>
        <Text style={styles.experiencesTitle}>Continue explorando a Vooa</Text>
        <View style={styles.experiencesGrid}>
          <Link href="/explore" asChild>
            <TouchableOpacity style={styles.experienceCard}>
              <FontAwesome name="compass" size={23} color="#2D79C7" />
              <Text style={styles.experienceTitle}>Destinos</Text>
              <Text style={styles.experienceDescription}>Explore novas viagens</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/ofertas" asChild>
            <TouchableOpacity style={styles.experienceCard}>
              <FontAwesome name="ticket" size={23} color="#EF624C" />
              <Text style={styles.experienceTitle}>Ofertas</Text>
              <Text style={styles.experienceDescription}>Encontre sua próxima passagem</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/diario" asChild>
            <TouchableOpacity style={styles.experienceCard}>
              <FontAwesome name="book" size={23} color="#2D79C7" />
              <Text style={styles.experienceTitle}>Meu diário</Text>
              <Text style={styles.experienceDescription}>Reviva suas viagens</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/historias" asChild>
            <TouchableOpacity style={styles.experienceCard}>
              <FontAwesome name="camera" size={23} color="#EF624C" />
              <Text style={styles.experienceTitle}>Histórias</Text>
              <Text style={styles.experienceDescription}>Inspire-se com a comunidade</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/diario-inicio" asChild>
            <TouchableOpacity style={styles.experienceCard}>
              <FontAwesome name="file-text-o" size={23} color="#2D79C7" />
              <Text style={styles.experienceTitle}>Memórias</Text>
              <Text style={styles.experienceDescription}>Acesse o diário original</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

export default function HomeScreen({ usuario }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#FCFBF9" />
      <View style={styles.homeContent}>
        <HomeContent usuario={usuario} />
      </View>
      <RouteTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFBF9' },
  homeContent: { flex: 1, minHeight: 0 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 18 },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 22,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#E8F3FC',
    borderWidth: 1,
    borderColor: '#C9DEEF',
  },
  welcomeCopy: { flex: 1, marginLeft: 14 },
  welcomeLabel: { color: '#929397', fontSize: 15, marginBottom: 2 },
  userName: { color: '#242528', fontSize: 21, fontWeight: '800' },
  notificationButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', right: 6, top: 4, width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF624C' },
  searchBox: {
    height: 48,
    borderRadius: 25,
    backgroundColor: '#F2F1EF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchPlaceholder: { color: '#929397', fontSize: 14, marginLeft: 10 },
  categories: { gap: 11, paddingRight: 20, paddingBottom: 24 },
  category: { paddingHorizontal: 13, height: 32, borderRadius: 18, justifyContent: 'center', backgroundColor: '#E8F3FC' },
  categorySelected: { backgroundColor: '#2D79C7' },
  categoryText: { color: '#2D79C7', fontSize: 12, fontWeight: '700' },
  categoryTextSelected: { color: '#FFFFFF' },
  sectionTitle: { color: '#242528', fontSize: 24, fontWeight: '700', marginBottom: 17 },
  deck: { alignSelf: 'center', position: 'relative' },
  card: { position: 'absolute', height: 350, borderRadius: 22, overflow: 'hidden', shadowColor: '#2E3740', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 8 },
  cardFront: { zIndex: 3 },
  cardBehind: { zIndex: 1 },
  cardRight: { zIndex: 2 },
  cardSurface: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#DDECF6' },
  favoriteButton: { position: 'absolute', top: 14, right: 14, width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFDFB', alignItems: 'center', justifyContent: 'center' },
  cardInfo: { padding: 19, paddingBottom: 21 },
  cardTitle: { color: '#FFFFFF', fontSize: 21, lineHeight: 25, fontWeight: '500' },
  cardCountry: { color: '#FFFFFF', fontSize: 21, lineHeight: 25, fontWeight: '800' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  rating: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginLeft: 5 },
  reviews: { color: '#FFFFFF', fontSize: 12, marginLeft: 5 },
  nextButton: { position: 'absolute', zIndex: 5, right: 13, bottom: 18, width: 48, height: 48, borderRadius: 24, backgroundColor: '#EF624C', alignItems: 'center', justifyContent: 'center' },
  experiences: { marginTop: 12, marginBottom: 22 },
  experiencesTitle: { color: '#242528', fontSize: 20, fontWeight: '800', marginBottom: 14 },
  experiencesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  experienceCard: {
    width: '48%',
    minHeight: 128,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDF1',
    justifyContent: 'center',
  },
  experienceTitle: { color: '#242528', fontSize: 14, fontWeight: '800', marginTop: 8 },
  experienceDescription: { color: '#85878B', fontSize: 11, lineHeight: 16, marginTop: 4 },
  logoutButton: { marginTop: 25, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, backgroundColor: '#EF624C' },
  logoutText: { color: '#FFFFFF', fontWeight: '700' },
});
