import { Redirect, Stack } from 'expo-router';
import { THEME, TYPOGRAPHY } from '@/lib/theme';
import { useAuth } from '@/providers/auth-provider';

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
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
