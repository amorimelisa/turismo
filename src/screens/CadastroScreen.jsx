import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

export default function CadastroScreen({
  onNavigate,
  animando = false,
}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  function cadastrar() {
    if (
      !nome.trim() ||
      !email.trim() ||
      !telefone.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
      return;
    }

    if (!email.trim().includes('@')) {
      Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
      return;
    }

    if (!/^\d+$/.test(telefone.trim())) {
      Alert.alert('Telefone inválido', 'Digite somente números no telefone.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        'Senha muito curta',
        'Sua senha precisa ter pelo menos 6 caracteres.'
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'As senhas digitadas não coincidem.');
      return;
    }

    Alert.alert(
      'Cadastro validado!',
      'Os dados estão preenchidos corretamente. A conexão com o banco de dados ainda precisa ser implementada.',
      [
        {
          text: 'Voltar ao Login',
          onPress: () => onNavigate('Login'),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#124D9B" />

      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient id="ceuCadastro" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#103F85" />
            <Stop offset="0.52" stopColor="#1268B8" />
            <Stop offset="1" stopColor="#36B6EF" />
          </LinearGradient>
        </Defs>
        <Rect width="390" height="844" fill="url(#ceuCadastro)" />
      </Svg>

      <KeyboardAvoidingView
        style={styles.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollConteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.voltar}
            onPress={() => onNavigate('Login')}
            disabled={animando}
            activeOpacity={0.75}
          >
            <FontAwesome name="chevron-left" size={14} color="#FFFFFF" style={styles.seta} />
            <Text style={styles.voltarTexto}>Voltar ao Login</Text>
          </TouchableOpacity>

          <View style={styles.cabecalho}>
            <View style={styles.logoCirculo}>
              <Text style={styles.logoSimbolo}>v</Text>
            </View>
            <Text style={styles.logoTexto}>vooa</Text>
            <Text style={styles.slogan}>
              Seu próximo destino começa aqui.
            </Text>
          </View>

          <View style={styles.cartao}>
            <Text style={styles.titulo}>Crie sua conta</Text>
            <Text style={styles.subtitulo}>
              Prepare-se para descobrir seu próximo destino.
            </Text>

            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#8998AA"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              editable={!animando}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#8998AA"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!animando}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu telefone"
              placeholderTextColor="#8998AA"
              value={telefone}
              onChangeText={(valor) => setTelefone(valor.replace(/\D/g, ''))}
              keyboardType="phone-pad"
              editable={!animando}
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.senhaContainer}>
              <TextInput
                style={styles.inputSenha}
                placeholder="Crie uma senha"
                placeholderTextColor="#8998AA"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
                editable={!animando}
              />
              <TouchableOpacity
                style={styles.botaoMostrar}
                onPress={() => setMostrarSenha(!mostrarSenha)}
                disabled={animando}
              >
                <Text style={styles.textoMostrar}>
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.senhaContainer}>
              <TextInput
                style={styles.inputSenha}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#8998AA"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!mostrarConfirmacao}
                editable={!animando}
              />
              <TouchableOpacity
                style={styles.botaoMostrar}
                onPress={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                disabled={animando}
              >
                <Text style={styles.textoMostrar}>
                  {mostrarConfirmacao ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.botaoPrincipal,
                animando && styles.desabilitado,
              ]}
              onPress={cadastrar}
              disabled={animando}
              activeOpacity={0.85}
            >
              <Text style={styles.botaoPrincipalTexto}>
                Criar minha conta
              </Text>
            </TouchableOpacity>

            <View style={styles.linhaLogin}>
              <Text style={styles.textoLogin}>Já possui uma conta?</Text>
              <TouchableOpacity
                onPress={() => onNavigate('Login')}
                disabled={animando}
              >
                <Text style={styles.linkLogin}> Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.rodape}>
            Descubra novos lugares. Viva novas histórias.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#124D9B',
  },
  teclado: {
    flex: 1,
  },
  scrollConteudo: {
    flexGrow: 1,
    paddingHorizontal: 23,
    paddingTop: Platform.OS === 'ios' ? 52 : 35,
    paddingBottom: 25,
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingRight: 12,
  },
  seta: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 34,
    marginRight: 7,
  },
  voltarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cabecalho: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 25,
  },
  logoCirculo: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSimbolo: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '800',
    lineHeight: 42,
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
  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 23,
    shadowColor: '#06264D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.17,
    shadowRadius: 22,
    elevation: 8,
  },
  titulo: {
    color: '#102A49',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#718198',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 15,
  },
  label: {
    color: '#243D5B',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 17,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#DCE7F1',
    borderRadius: 12,
    backgroundColor: '#F8FBFE',
    paddingHorizontal: 13,
    color: '#102A49',
    fontSize: 13,
  },
  senhaContainer: {
    height: 45,
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
  botaoPrincipal: {
    minHeight: 49,
    backgroundColor: '#1478C8',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 23,
    shadowColor: '#1478C8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  desabilitado: {
    opacity: 0.7,
  },
  botaoPrincipalTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  linhaLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 19,
  },
  textoLogin: {
    color: '#718198',
    fontSize: 12,
  },
  linkLogin: {
    color: '#1478C8',
    fontSize: 12,
    fontWeight: '800',
  },
  rodape: {
    textAlign: 'center',
    color: '#EAF7FF',
    fontSize: 11,
    marginTop: 23,
  },
});