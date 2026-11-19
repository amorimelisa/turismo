import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { logout } from '@/services/auth';

const SESSION_KEY = '@vooa_usuario';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [restaurandoSessao, setRestaurandoSessao] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const savedSession = await AsyncStorage.getItem(SESSION_KEY);
        if (!savedSession) return;

        const session = JSON.parse(savedSession);
        if (
          session &&
          typeof session.name === 'string' &&
          typeof session.email === 'string'
        ) {
          if (active) setUsuario(session);
        } else {
          await AsyncStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        console.error('Não foi possível restaurar a sessão:', error);
        Alert.alert('Aviso', 'Não foi possível restaurar sua sessão salva.');
      } finally {
        if (active) setRestaurandoSessao(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const iniciarSessao = useCallback(async (session) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUsuario(session);
  }, []);

  const encerrarSessao = useCallback(async () => {
    const token = usuario?.accessToken;
    await AsyncStorage.removeItem(SESSION_KEY);
    setUsuario(null);
    if (token) {
      try {
        await logout(token);
      } catch (error) {
        console.error('Não foi possível revogar a sessão na API:', error);
      }
    }
  }, [usuario]);

  return (
    <AuthContext.Provider
      value={{ usuario, restaurandoSessao, iniciarSessao, encerrarSessao }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
