import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useAuth } from "@/context/AuthContext"

export default function StudentIndex() {
  const { user, signOut } = useAuth()

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: signOut, style: "destructive" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>STUDENT</Text>
      <Text style={styles.title}>Student Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {user?.name ?? user?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030712", alignItems: "center", justifyContent: "center", padding: 24 },
  badge: { color: "#22c55e", fontWeight: "bold", letterSpacing: 2, marginBottom: 8 },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  subtitle: { color: "#9ca3af", marginBottom: 32 },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
})
