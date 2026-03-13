import { View, Text, StyleSheet } from "react-native"
import { useAuth } from "../../context/AuthContext"

export default function AdminIndex() {
  const { user, signOut } = useAuth()
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>ADMIN</Text>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {user?.name ?? user?.email}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030712", alignItems: "center", justifyContent: "center", padding: 24 },
  badge: { color: "#ef4444", fontWeight: "bold", letterSpacing: 2, marginBottom: 8 },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  subtitle: { color: "#9ca3af" },
})
