import { View, Text, StyleSheet } from "react-native"

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Profile</Text>
      <Text style={styles.subtitle}>View and manage your profile here.</Text>
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
