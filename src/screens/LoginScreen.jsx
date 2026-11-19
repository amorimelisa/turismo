
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
} from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

function NuvensBrancas({ largura }) {
  return (
    <Svg
      width={largura}
      height={100}
      viewBox="0 0 390 100"
      preserveAspectRatio="none"
      style={styles.nuvens}
    >
      <Defs>
        <LinearGradient id="brilhoNuvens" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#D5F2FF" />
          <Stop offset="0.55" stopColor="#F4FCFF" />
          <Stop offset="1" stopColor="#FFFFFF" />
        </LinearGradient>
      </Defs>

      {/* Nuvens azuladas ao fundo: uma silhueta orgânica contínua. */}
      <Path
        d="
          M0 40
          C13 35 18 20 33 25
          C47 29 50 43 65 39
          C79 35 83 15 99 20
          C116 25 119 42 136 39
          C151 36 157 18 174 24
          C189 29 192 44 208 39
          C224 34 229 16 246 22
          C262 27 267 44 283 39
          C299 34 304 19 320 25
          C337 31 341 44 357 37
          C369 32 379 31 390 35
          L390 100 L0 100 Z
        "
        fill="#8BD9FF"
        fillOpacity="0.92"
      />

      {/* Frente branca: ondas de alturas e larguras diferentes. */}
      <Path
        d="
          M0 52
          C10 48 16 35 29 39
          C43 42 45 57 59 55
          C72 53 78 35 92 39
          C106 43 110 60 124 57
          C138 54 142 39 157 42
          C171 45 176 62 190 58
          C204 54 210 38 224 42
          C239 46 242 61 257 57
          C271 53 277 39 291 43
          C306 47 309 61 324 57
          C339 53 345 42 359 46
          C371 49 380 43 390 45
          L390 100 L0 100 Z
        "
        fill="url(#brilhoNuvens)"
      />

      {/* Reflexo delicado, sem contorno duro ou círculos repetidos. */}
      <Path
        d="
          M0 52
          C10 48 16 35 29 39
          C43 42 45 57 59 55
          C72 53 78 35 92 39
          C106 43 110 60 124 57
          C138 54 142 39 157 42
          C171 45 176 62 190 58
          C204 54 210 38 224 42
          C239 46 242 61 257 57
          C271 53 277 39 291 43
          C306 47 309 61 324 57
          C339 53 345 42 359 46
          C371 49 380 43 390 45
        "
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeOpacity="0.8"
      />
    </Svg>
  );
}

export default function LoginScreen({
  onNavigate,
  animando = false,
  painelY,
}) {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // O painel começa mais abaixo em telas curtas, para preservar o formulário.
  const topoPainel = Math.min(260, height * 0.31);

  function entrar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha seu e-mail e sua senha.');
      return;
    }

    if (!email.trim().includes('@')) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    Alert.alert(
      'Login',
      'A conexão com o sistema de autenticação ainda precisa ser implementada.'
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#124D9B" />

      {/* O céu existe desde o início; não entra como um retângulo novo. */}
      <Svg
        width={width}
        height={height}
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient id="ceuLoginBase" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#103D82" />
            <Stop offset="0.36" stopColor="#1264B5" />
            <Stop offset="0.72" stopColor="#2699DF" />
            <Stop offset="1" stopColor="#72D9FA" />
          </LinearGradient>
        </Defs>
        <Rect width="390" height="844" fill="url(#ceuLoginBase)" />
      </Svg>

      {/* Marca posicionada no céu, fora do painel branco animado. */}
      <View style={styles.marca}>
        <View style={styles.logoCirculo}>
          <Text style={styles.logoSimbolo}>v</Text>
        </View>
        <Text style={styles.logoTexto}>vooa</Text>
        <Text style={styles.slogan}>
          Seu próximo destino começa aqui.
        </Text>
      </View>

      {/* O branco e as nuvens são uma única peça. */}
      <Animated.View
        style={[
          styles.painelBranco,
          {
            top: topoPainel,
            transform: [{ translateY: painelY }],
          },
        ]}
      >
        <NuvensBrancas largura={width} />

        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.titulo}>Que bom ter você de volta!</Text>
          <Text style={styles.subtitulo}>
            Entre na sua conta e continue planejando suas viagens.
          </Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#8998AA"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!animando}
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.senhaContainer}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Digite sua senha"
              placeholderTextColor="#8998AA"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
              editable={!animando}
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              disabled={animando}
              style={styles.botaoMostrar}
            >
              <Text style={styles.textoMostrar}>
                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Recuperar senha',
                'A recuperação estará disponível após a integração do sistema.'
              )
            }
            disabled={animando}
            style={styles.recuperar}
          >
            <Text style={styles.recuperarTexto}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={entrar}
            disabled={animando}
            activeOpacity={0.85}
          >
            <Text style={styles.botaoPrincipalTexto}>
              Entrar na minha conta
            </Text>
          </TouchableOpacity>

          <View style={styles.linhaCadastro}>
            <Text style={styles.textoCadastro}>
              Ainda não tem uma conta?
            </Text>
            <TouchableOpacity
              onPress={() => onNavigate('Cadastro')}
              disabled={animando}
            >
              <Text style={styles.linkCadastro}> Cadastre-se</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.rodape}>
            Descubra novos lugares. Viva novas histórias.
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1268B8',
    overflow: 'hidden',
  },
  marca: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoCirculo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSimbolo: {
    color: '#FFFFFF',
    fontSize: 37,
    fontWeight: '800',
    lineHeight: 43,
  },
  logoTexto: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 1,
  },
  slogan: {
    color: '#EAF7FF',
    fontSize: 12,
    marginTop: 5,
  },
  painelBranco: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'visible',
  },
  nuvens: {
    position: 'absolute',
    top: -60,
    left: 0,
  },
  conteudo: {
    flexGrow: 1,
    paddingTop: 45,
    paddingHorizontal: 27,
    paddingBottom: 25,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    color: '#102A49',
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#718198',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 14,
  },
  label: {
    color: '#243D5B',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#DCE7F1',
    borderRadius: 12,
    backgroundColor: '#F8FBFE',
    paddingHorizontal: 13,
    color: '#102A49',
    fontSize: 13,
  },
  senhaContainer: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE7F1',
    borderRadius: 12,
    backgroundColor: '#F8FBFE',
  },
  inputSenha: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 13,
    color: '#102A49',
    fontSize: 13,
  },
  botaoMostrar: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textoMostrar: {
    color: '#1479C8',
    fontSize: 11,
    fontWeight: '700',
  },
  recuperar: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
  },
  recuperarTexto: {
    color: '#1479C8',
    fontSize: 12,
    fontWeight: '700',
  },
  botaoPrincipal: {
    minHeight: 49,
    borderRadius: 14,
    backgroundColor: '#1478C8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  botaoPrincipalTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  linhaCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 19,
  },
  textoCadastro: {
    color: '#718198',
    fontSize: 12,
  },
  linkCadastro: {
    color: '#1478C8',
    fontSize: 12,
    fontWeight: '800',
  },
  rodape: {
    color: '#8B9BAE',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 23,
  },
});
