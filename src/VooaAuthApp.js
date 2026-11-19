import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Link, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import TravelTransition from './components/TravelTransition';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { login, register } from './services/auth';

function AppContent() {
  const { height: windowHeight } = useWindowDimensions();
  const { usuario, restaurandoSessao, iniciarSessao } = useAuth();
  const [height, setHeight] = useState(windowHeight);
  const [campoFocado, setCampoFocado] = useState(null);
  const [isCadastro, setIsCadastro] = useState(false);
  const [animando, setAnimando] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [mostrarSenhaCadastro, setMostrarSenhaCadastro] = useState(false);
  const [mostrarBoasVindas, setMostrarBoasVindas] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroLogin, setErroLogin] = useState('');

  const progresso = useRef(new Animated.Value(0)).current;
  const opacidadeLogin = useRef(new Animated.Value(1)).current;
  const opacidadeCadastro = useRef(new Animated.Value(0)).current;
  const concluirBoasVindas = useCallback(
    () => setMostrarBoasVindas(false),
    []
  );

  function navegar(cadastro) {
    if (animando || cadastro === isCadastro) return;

    setAnimando(true);
    Animated.parallel([
      Animated.timing(progresso, {
        toValue: cadastro ? 1 : 0,
        duration: 850,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(opacidadeLogin, {
        toValue: cadastro ? 0 : 1,
        duration: 420,
        delay: cadastro ? 120 : 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacidadeCadastro, {
        toValue: cadastro ? 1 : 0,
        duration: 420,
        delay: cadastro ? 300 : 120,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setIsCadastro(cadastro);
      setAnimando(false);
    });
  }

  async function entrar() {
    setErroLogin('');
    if (!email.trim() || !senha) {
      setErroLogin('Preencha seu e-mail e sua senha.');
      return;
    }
    if (!email.trim().includes('@')) {
      setErroLogin('Digite um endereço de e-mail válido.');
      return;
    }
    setEnviando(true);
    try {
      const usuarioAutenticado = await login(email.trim(), senha);
      if (
        !usuarioAutenticado ||
        typeof usuarioAutenticado.name !== 'string' ||
        typeof usuarioAutenticado.email !== 'string'
      ) {
        throw new Error('A API não retornou os dados necessários da conta.');
      }
      await iniciarSessao(usuarioAutenticado);
      setMostrarBoasVindas(true);
    } catch (error) {
      setErroLogin(
        error instanceof Error
          ? error.message
          : 'Não foi possível entrar. Tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  }

  async function cadastrar() {
    if (!nome.trim() || !emailCadastro.trim() || !telefone.trim() || !senhaCadastro) {
      Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
      return;
    }
    if (!emailCadastro.trim().includes('@')) {
      Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
      return;
    }
    if (senhaCadastro.length < 6) {
      Alert.alert('Senha muito curta', 'Sua senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setEnviando(true);
    try {
      await register({
        name: nome.trim(),
        email: emailCadastro.trim(),
        phone: telefone.trim(),
        password: senhaCadastro,
      });
      setEmail(emailCadastro.trim());
      setSenha('');
      navegar(false);
    } catch (error) {
      Alert.alert('Não foi possível cadastrar', error.message);
    } finally {
      setEnviando(false);
    }
  }

  if (restaurandoSessao) {
    return (
      <View style={styles.sessionLoading}>
        <Text style={styles.sessionLoadingText}>Preparando sua viagem...</Text>
      </View>
    );
  }

  if (usuario?.role === 'admin') {
    return <Redirect href="/admin" />;
  }

  if (usuario && mostrarBoasVindas) {
    return <WelcomeScreen onComplete={concluirBoasVindas} />;
  }

  if (usuario) {
    return (
      <HomeScreen usuario={usuario} />
    );
  }

  const loginTop = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.34 + 62, height * 0.87 + 62],
    extrapolate: 'clamp',
  });
  const cadastroTop = Math.min(150, height * 0.24);
  const cadastroHeight = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(0, height - cadastroTop)],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        onLayout={({ nativeEvent }) => setHeight(nativeEvent.layout.height)}
      >
        <View style={styles.container}>
        <TravelTransition
          progresso={progresso}
          alturaTela={height}
        />

        <Animated.View
          pointerEvents={isCadastro ? 'none' : 'auto'}
          style={[
            styles.loginForm,
            { top: loginTop, opacity: opacidadeLogin },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.loginContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.loginTitle}>Bem-vindo de volta</Text>
            <Text style={styles.loginSubtitle}>
              Entre para continuar planejando suas viagens.
            </Text>

            <Text style={styles.loginLabel}>E-mail</Text>
            <TextInput
              style={[
                styles.loginInput,
                campoFocado === 'login-email' && styles.focusedLoginInput,
              ]}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#9AAABD"
              value={email}
              onChangeText={(valor) => {
                setEmail(valor);
                setErroLogin('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!animando}
              onFocus={() => setCampoFocado('login-email')}
              onBlur={() => setCampoFocado(null)}
            />

            <Text style={styles.loginLabel}>Senha</Text>
            <View
              style={[
                styles.loginPassword,
                campoFocado === 'login-password' && styles.focusedLoginPassword,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha"
                placeholderTextColor="#9AAABD"
                value={senha}
                onChangeText={(valor) => {
                  setSenha(valor);
                  setErroLogin('');
                }}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                editable={!animando}
                onFocus={() => setCampoFocado('login-password')}
                onBlur={() => setCampoFocado(null)}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                disabled={animando}
                accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <FontAwesome
                  name={mostrarSenha ? 'eye' : 'eye-slash'}
                  size={21}
                  color="#7890A8"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgot}
              onPress={() => Alert.alert('Esqueceu a senha?', 'A recuperação de senha estará disponível em breve.')}
              disabled={animando}
            >
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={entrar}
              disabled={animando || enviando}
              activeOpacity={0.86}
            >
              <Text style={styles.loginButtonText}>
                {enviando ? 'Entrando...' : 'Entrar'}
              </Text>
              <FontAwesome name="arrow-right" size={19} color="#FFFFFF" />
            </TouchableOpacity>

            {erroLogin ? (
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={styles.loginError}
              >
                {erroLogin}
              </Text>
            ) : null}

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Ainda não tem uma conta?</Text>
              <TouchableOpacity onPress={() => navegar(true)} disabled={animando}>
                <Text style={styles.switchLink}> Cadastrar</Text>
              </TouchableOpacity>
            </View>
            <Link href="/explore" asChild>
              <Pressable style={styles.guestLink}>
                <Text style={styles.guestLinkText}>Explorar sem entrar</Text>
              </Pressable>
            </Link>
            <Link href="/admin-login" asChild>
              <Pressable style={styles.adminLink}>
                <Text style={styles.adminLinkText}>Acesso de administrador</Text>
              </Pressable>
            </Link>
          </ScrollView>
        </Animated.View>

        <Animated.View
          pointerEvents={isCadastro ? 'auto' : 'none'}
          style={[
            styles.registerForm,
            { top: cadastroTop, height: cadastroHeight, opacity: opacidadeCadastro },
          ]}
        >
            <ScrollView
              contentContainerStyle={styles.registerContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View>
                <Text style={styles.registerTitle}>Crie sua conta</Text>
                <Text style={styles.registerSubtitle}>
                  Prepare-se para sua próxima viagem.
                </Text>
              </View>

              <View style={styles.registerField}>
                <Text style={styles.registerLabel}>Nome completo</Text>
                <TextInput
                  style={[
                    styles.registerInput,
                    campoFocado === 'register-name' && styles.focusedRegisterInput,
                  ]}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="rgba(255,255,255,0.72)"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                  editable={!animando}
                  onFocus={() => setCampoFocado('register-name')}
                  onBlur={() => setCampoFocado(null)}
                />
              </View>

              <View style={styles.registerField}>
                <Text style={styles.registerLabel}>E-mail</Text>
                <TextInput
                  style={[
                    styles.registerInput,
                    campoFocado === 'register-email' && styles.focusedRegisterInput,
                  ]}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor="rgba(255,255,255,0.72)"
                  value={emailCadastro}
                  onChangeText={setEmailCadastro}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!animando}
                  onFocus={() => setCampoFocado('register-email')}
                  onBlur={() => setCampoFocado(null)}
                />
              </View>

              <View style={styles.registerField}>
                <Text style={styles.registerLabel}>Celular</Text>
                <TextInput
                  style={[
                    styles.registerInput,
                    campoFocado === 'register-phone' && styles.focusedRegisterInput,
                  ]}
                  placeholder="Somente números"
                  placeholderTextColor="rgba(255,255,255,0.72)"
                  value={telefone}
                  onChangeText={(valor) => setTelefone(valor.replace(/\D/g, ''))}
                  keyboardType="phone-pad"
                  editable={!animando}
                  onFocus={() => setCampoFocado('register-phone')}
                  onBlur={() => setCampoFocado(null)}
                />
              </View>

              <View style={styles.registerField}>
                <Text style={styles.registerLabel}>Senha</Text>
                <View
                  style={[
                    styles.registerPassword,
                    campoFocado === 'register-password' && styles.focusedRegisterPassword,
                  ]}
                >
                  <TextInput
                    style={styles.registerPasswordInput}
                    placeholder="Mínimo de 6 caracteres"
                    placeholderTextColor="rgba(255,255,255,0.72)"
                    value={senhaCadastro}
                    onChangeText={setSenhaCadastro}
                    secureTextEntry={!mostrarSenhaCadastro}
                    autoCapitalize="none"
                    editable={!animando}
                    onFocus={() => setCampoFocado('register-password')}
                    onBlur={() => setCampoFocado(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setMostrarSenhaCadastro(!mostrarSenhaCadastro)}
                    disabled={animando || enviando}
                    accessibilityLabel={mostrarSenhaCadastro ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <FontAwesome
                      name={mostrarSenhaCadastro ? 'eye' : 'eye-slash'}
                      size={20}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={cadastrar}
                  disabled={animando || enviando}
                  activeOpacity={0.86}
                >
                  <Text style={styles.registerButtonText}>
                    {enviando ? 'Criando conta...' : 'Criar conta'}
                  </Text>
                  <FontAwesome name="arrow-right" size={19} color="#438FCE" />
                </TouchableOpacity>
                <View style={styles.registerSwitchRow}>
                  <Text style={styles.registerSwitchText}>Já tem uma conta?</Text>
                  <TouchableOpacity onPress={() => navegar(false)} disabled={animando || enviando}>
                    <Text style={styles.registerSwitchLink}> Entrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
        </Animated.View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  return <AppContent />;
}

const styles = StyleSheet.create({
  sessionLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F3F5',
  },
  sessionLoadingText: {
    color: '#587087',
    fontSize: 14,
    fontWeight: '600',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F3F5',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F1F3F5',
  },
  loginForm: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 29,
    paddingTop: 12,
    paddingBottom: 22,
  },
  loginTitle: {
    color: '#17324D',
    fontSize: 25,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  loginSubtitle: {
    color: '#7D91A5',
    fontSize: 13,
    marginTop: 5,
    marginBottom: 19,
  },
  loginLabel: {
    color: '#587087',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  loginInput: {
    height: 47,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#CDD3DA',
    backgroundColor: '#E3E6EA',
    color: '#1D3852',
    paddingHorizontal: 14,
    fontSize: 13,
    marginBottom: 13,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  focusedLoginInput: {
    borderColor: '#4F9FDD',
    backgroundColor: '#FFFFFF',
  },
  focusedLoginPassword: {
    borderColor: '#4F9FDD',
    backgroundColor: '#FFFFFF',
  },
  focusedRegisterInput: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  focusedRegisterPassword: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  loginPassword: {
    minHeight: 47,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#CDD3DA',
    backgroundColor: '#E3E6EA',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  passwordInput: {
    flex: 1,
    height: 45,
    color: '#1D3852',
    fontSize: 13,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  forgot: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  forgotText: {
    color: '#4B95D1',
    fontSize: 11,
    fontWeight: '600',
  },
  loginButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#4F9FDD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 8,
    shadowColor: '#4F9FDD',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.23,
    shadowRadius: 12,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loginError: {
    color: '#B42318',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  switchText: {
    color: '#8294A6',
    fontSize: 12,
  },
  switchLink: {
    color: '#438FCE',
    fontSize: 12,
    fontWeight: '700',
  },
  guestLink: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  guestLinkText: {
    color: '#587087',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  adminLink: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  adminLinkText: {
    color: '#587087',
    fontSize: 11,
    fontWeight: '600',
  },
  registerForm: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 3,
  },
  registerContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  registerField: {
    width: '100%',
    marginBottom: 7,
  },
  registerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  registerSubtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 12,
  },
  registerLabel: {
    color: 'rgba(255,255,255,0.94)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 5,
    marginLeft: 3,
  },
  registerInput: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.13)',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 12,
    marginBottom: 0,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  registerPassword: {
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.13)',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  registerPasswordInput: {
    flex: 1,
    height: 38,
    color: '#FFFFFF',
    fontSize: 12,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  registerButton: {
    minHeight: 38,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 0,
    shadowColor: '#245F93',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 9,
    elevation: 3,
  },
  registerButtonText: {
    color: '#438FCE',
    fontSize: 13,
    fontWeight: '700',
  },
  registerSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerSwitchText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
  },
  registerSwitchLink: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
