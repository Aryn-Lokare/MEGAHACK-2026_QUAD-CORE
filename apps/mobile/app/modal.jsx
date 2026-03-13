import { useRouter } from 'expo-router';
import LoginScreen from '@/components/auth/LoginScreen';

export default function AuthModal() {
  const router = useRouter();

  const handleLoginSuccess = (role) => {
    // The RootNavigator in _layout.jsx handles role-based redirection,
    // but we dismiss the modal here to let the redirect take effect.
    router.dismiss();
  };

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
