import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import "react-native-reanimated"
import { useColorScheme } from "../hooks/use-color-scheme"
import { AuthProvider, useAuth } from "../context/AuthContext"

export const unstable_settings = {
  anchor: "(student)",
}

function RootNavigator() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/modal")
      return
    }

    switch (user.role) {
      case "ADMIN":
        router.replace("/(admin)")
        break
      case "FACULTY":
        router.replace("/(faculty)")
        break
      case "STUDENT":
      default:
        router.replace("/(student)")
    }
  }, [user, loading])

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(faculty)" options={{ headerShown: false }} />
        <Stack.Screen name="(student)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Login" }} />
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
