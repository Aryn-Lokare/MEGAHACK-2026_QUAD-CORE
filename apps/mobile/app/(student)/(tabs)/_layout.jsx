import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../../../hooks/use-theme-color';

export default function StudentTabsLayout() {
  const tintColor = '#22c55e'; // Student green

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: tintColor, headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'AI',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Complaints',
          headerTitle: 'Support & Tickets',
          tabBarIcon: ({ color }) => <Ionicons name="alert-circle-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
