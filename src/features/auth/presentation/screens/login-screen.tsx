import { valibotResolver } from '@hookform/resolvers/valibot';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  loginSchema,
  type LoginFormInput,
  type LoginFormOutput,
} from '@/features/auth/domain/schemas/login-schema';
import { useAuth, useSendMagicLinkMutation } from '@/features/auth/presentation/hooks/use-auth';
import { FormTextField } from '@/shared/components/form/form-field';
import { Button } from '@/shared/components/ui/button';
import { FeedbackBanner } from '@/shared/components/ui/feedback-banner';
import { Text } from '@/shared/components/ui/text';
import { THEME } from '@/shared/lib/theme';
import { getErrorMessage } from '@/shared/utils/errors';

export function LoginScreen() {
  const { isAuthenticated, authError, clearAuthError } = useAuth();
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);
  const sendMagicLinkMutation = useSendMagicLinkMutation();

  const { control, handleSubmit } = useForm<LoginFormInput, unknown, LoginFormOutput>({
    resolver: valibotResolver(loginSchema),
    defaultValues: { email: '' },
  });

  if (isAuthenticated) {
    return <Redirect href="/journals" />;
  }

  const displayError = sendMagicLinkMutation.error
    ? getErrorMessage(sendMagicLinkMutation.error, 'Unable to send magic link.')
    : authError;

  const isSubmitting = sendMagicLinkMutation.isPending;

  const handleSendMagicLink = async (values: LoginFormOutput) => {
    clearAuthError();
    sendMagicLinkMutation.reset();

    try {
      const normalizedEmail = await sendMagicLinkMutation.mutateAsync(values.email);
      setSentToEmail(normalizedEmail);
    } catch {
      // Mutation error state renders in FeedbackBanner
    }
  };

  const handleResend = () => {
    if (!sentToEmail || isSubmitting) {
      return;
    }
    void handleSendMagicLink({ email: sentToEmail });
  };

  const handleReset = () => {
    setSentToEmail(null);
    sendMagicLinkMutation.reset();
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

            {displayError ? <FeedbackBanner variant="error" message={displayError} /> : null}

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
                  <Button onPress={handleResend} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <ActivityIndicator color={THEME.primaryForeground} />
                    ) : (
                      <Text>Resend magic link</Text>
                    )}
                  </Button>

                  <Button variant="ghost" onPress={handleReset} disabled={isSubmitting}>
                    <Text>Use a different email</Text>
                  </Button>
                </View>
              </View>
            ) : (
              <View className="gap-6">
                <FormTextField
                  control={control}
                  name="email"
                  label="Email address"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!isSubmitting}
                  onSubmitEditing={() => {
                    void handleSubmit(handleSendMagicLink)();
                  }}
                  returnKeyType="send"
                  accessibilityLabel="Email address"
                />

                <Button
                  onPress={() => {
                    void handleSubmit(handleSendMagicLink)();
                  }}
                  disabled={isSubmitting}
                >
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
