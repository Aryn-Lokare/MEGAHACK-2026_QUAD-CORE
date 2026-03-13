import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function IndexRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    if (user.role === 'ADMIN') return <Redirect href="/(admin)" />;
    if (user.role === 'FACULTY') return <Redirect href="/(faculty)" />;
    return <Redirect href="/(student)" />;
  }

  return <Redirect href="/modal" />; // Redirect to login modal if not authenticated
}
