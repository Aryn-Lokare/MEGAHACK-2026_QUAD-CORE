import { useRouter } from 'expo-router';
import LoginScreen from '../components/auth/LoginScreen';

export default function AuthModal() {
  const router = useRouter();

  const handleLoginSuccess = (role) => {
    if (role === 'ADMIN') router.replace('/(admin)');
    else if (role === 'FACULTY') router.replace('/(faculty)');
    else router.replace('/(student)');
  };

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
