import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PlannerScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Study Planner</ThemedText>
      <ThemedText>Organize your sessions!</ThemedText>
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
