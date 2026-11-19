import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import HistoriasScreen from '@/screens/HistoriasScreen';

export default function HistoriasRoute() {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/')}
        style={styles.backButton}
      >
        <Text style={styles.backText}>‹ Voltar para Vooa</Text>
      </Pressable>
      <View style={styles.content}>
        <HistoriasScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    minHeight: 44,
    paddingHorizontal: 18,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backText: {
    color: '#143252',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
});
