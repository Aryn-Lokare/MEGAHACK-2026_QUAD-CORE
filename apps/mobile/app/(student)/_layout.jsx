import { Stack } from 'expo-router';

export default function StudentStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications', presentation: 'card' }} />
    </Stack>
  );
}
