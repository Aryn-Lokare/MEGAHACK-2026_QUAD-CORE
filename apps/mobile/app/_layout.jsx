import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { Stack, useRouter, useSegments } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import "react-native-reanimated"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { AuthProvider, useAuth } from "@/context/AuthContext"

function RootNavigator() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (loading) return

    const inAuthGroup =
      segments[0] === "(admin)" ||
      segments[0] === "(faculty)" ||
      segments[0] === "(student)"

    if (!user && inAuthGroup) {
      // Logged out — defer redirect so Expo Router has finished its current render cycle
      console.log("[RootNavigator] No session, redirecting to login.")
      setTimeout(() => router.replace("/"), 0)
    } else if (user && !inAuthGroup) {
      // Logged in — navigate to correct dashboard
      console.log("[RootNavigator] Session active, navigating to dashboard:", user.role)
      if (user.role === "ADMIN") {
        router.replace("/(admin)")
      } else if (user.role === "FACULTY") {
        router.replace("/(faculty)")
      } else {
        router.replace("/(student)")
      }
    }
  }, [user, loading])

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(faculty)" options={{ headerShown: false }} />
        <Stack.Screen name="(student)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}