import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function FacultyLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#3b82f6" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Students",
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  )
}
