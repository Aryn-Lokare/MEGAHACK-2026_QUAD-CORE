import { View, Text, StyleSheet } from "react-native"

export default function NoticeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notices</Text>
      <Text style={styles.subtitle}>Important announcements will appear here.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
})
