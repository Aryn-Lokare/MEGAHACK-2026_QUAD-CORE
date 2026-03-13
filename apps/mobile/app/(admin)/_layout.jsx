import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#ef4444" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  )
}
