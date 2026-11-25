import '../../global.css';

import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthBootstrapper, useAuth } from '@/features/auth';
import { QueryProvider } from '@/shared/infrastructure/query/query-provider';
import { NAV_THEME, THEME } from '@/shared/lib/theme';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    if (Platform.OS !== 'web') {
      return null;
    }

    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={THEME.foreground} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: THEME.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Protected guard={!isAuthenticated} redirectTo="/journals">
        <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated} redirectTo="/login">
        <Stack.Screen name="(user)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={NAV_THEME}>
        <QueryProvider>
          <AuthBootstrapper>
            <StatusBar style="light" />
            <RootNavigator />
            <PortalHost />
          </AuthBootstrapper>
        </QueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
