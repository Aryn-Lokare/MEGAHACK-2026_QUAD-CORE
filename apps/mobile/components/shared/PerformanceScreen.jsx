import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PerformanceScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Performance Metrics</ThemedText>
      <ThemedText>Tracking your progress...</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
