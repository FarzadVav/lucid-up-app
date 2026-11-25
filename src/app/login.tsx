import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useAuth } from '@/providers/auth-provider';
import { getAuthRedirectUrl } from '@/utils/auth-redirect';
import { supabase } from '@/utils/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { isAuthenticated, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Redirect href="/profile" />;
  }

  const displayError = formError ?? authError;

  const handleSendMagicLink = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    setFormError(null);
    clearAuthError();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
        },
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      setSentToEmail(trimmedEmail);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to send magic link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSentToEmail(null);
    setFormError(null);
    clearAuthError();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow justify-center px-6 py-10"
        >
          <View className="w-full max-w-md self-center gap-8">
            <View className="gap-3">
              <Text variant="subtext" className="text-accent-foreground">
                Lucid Up
              </Text>
              <Text variant="title">Sign in with Email</Text>
              <Text className="text-text-secondary">
                Enter your email address and we will send you a magic link to sign in without a
                password.
              </Text>
            </View>

            {displayError ? (
              <View className="rounded-sm bg-surface-muted p-4" accessibilityRole="alert">
                <Text variant="subtext" className="text-foreground">
                  {displayError}
                </Text>
              </View>
            ) : null}

            {sentToEmail ? (
              <View className="gap-6">
                <View className="gap-3 rounded-md bg-accent-soft p-6">
                  <Text variant="title" className="text-accent-foreground">
                    Check your inbox
                  </Text>
                  <Text>
                    We sent a magic link to <Text className="font-semibold">{sentToEmail}</Text>.
                    Open the link on this device to finish signing in.
                  </Text>
                </View>

                <View className="gap-3">
                  <Button onPress={handleSendMagicLink} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <ActivityIndicator color={THEME.primaryForeground} />
                    ) : (
                      <Text>Resend magic link</Text>
                    )}
                  </Button>

                  <Button variant="ghost" onPress={handleReset}>
                    <Text>Use a different email</Text>
                  </Button>
                </View>
              </View>
            ) : (
              <View className="gap-6">
                <View className="gap-2">
                  <Text variant="subtext">Email address</Text>
                  <Input
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (formError) setFormError(null);
                      if (authError) clearAuthError();
                    }}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!isSubmitting}
                    onSubmitEditing={handleSendMagicLink}
                    returnKeyType="send"
                    accessibilityLabel="Email address"
                  />
                </View>

                <Button onPress={handleSendMagicLink} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <ActivityIndicator color={THEME.primaryForeground} />
                  ) : (
                    <Text>Send magic link</Text>
                  )}
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
