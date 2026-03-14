import { Stack } from 'expo-router';

export default function StudentStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications', presentation: 'card' }} />
      <Stack.Screen name="avatar-picker" options={{ title: 'Choose Avatar', presentation: 'card' }} />
      <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile', presentation: 'card' }} />
    </Stack>
  );
}
