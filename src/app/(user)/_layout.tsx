import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/providers/auth-provider';

export default function UserLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
