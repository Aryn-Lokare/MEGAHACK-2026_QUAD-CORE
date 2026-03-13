import LoginScreen from '@/components/auth/LoginScreen';

// This is the public entry point — it only shows the login screen.
// Navigation after login/logout is handled entirely by _layout.jsx (RootNavigator).
export default function Index() {
  return <LoginScreen />;
}