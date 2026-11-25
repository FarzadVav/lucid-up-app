import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/features/auth';
import { THEME, TYPOGRAPHY } from '@/shared/lib/theme';

export default function UserLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: THEME.background,
        },
        headerTintColor: THEME.foreground,
        headerTitleStyle: {
          fontSize: TYPOGRAPHY.text.fontSize,
          fontWeight: TYPOGRAPHY.text.fontWeight,
          color: THEME.foreground,
        },
        contentStyle: {
          backgroundColor: THEME.background,
        },
      }}
    >
      <Stack.Screen name="journals/index" options={{ headerShown: false }} />
      <Stack.Screen name="journals/new" options={{ headerShown: false }} />
      <Stack.Screen name="journals/[journalId]" options={{ headerShown: false }} />
      <Stack.Screen name="journals/categories/new" options={{ headerShown: false }} />
      <Stack.Screen name="journals/categories/[categoryId]" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
