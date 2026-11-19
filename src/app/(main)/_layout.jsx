import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import Header from '@/components/Header';
import RouteTabBar from '@/components/RouteTabBar';

export default function MainLayout() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Slot />
      </View>
      <RouteTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
});
