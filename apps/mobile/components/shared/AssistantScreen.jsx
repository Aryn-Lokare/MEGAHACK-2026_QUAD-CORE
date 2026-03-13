import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AssistantScreen({ role }) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">AI Assistant</ThemedText>
      <ThemedText>Hello {role}! How can I help you today?</ThemedText>
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
