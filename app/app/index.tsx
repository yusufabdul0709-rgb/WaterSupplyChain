import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Redirect to splash first for branding, then auth state determines destination
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/splash');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return null;
}
