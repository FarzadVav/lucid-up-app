import { valibotResolver } from '@hookform/resolvers/valibot';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useSignOutMutation } from '@/features/auth';
import {
  profileSchema,
  type ProfileFormInput,
  type ProfileFormOutput,
} from '@/features/profile/domain/schemas/profile-schema';
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from '@/features/profile/presentation/hooks/use-profile';
import { FormTextField } from '@/shared/components/form/form-field';
import { Button } from '@/shared/components/ui/button';
import { FeedbackBanner } from '@/shared/components/ui/feedback-banner';
import { Text } from '@/shared/components/ui/text';
import { THEME } from '@/shared/lib/theme';
import { getErrorMessage } from '@/shared/utils/errors';

export function ProfileScreen() {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const signOutMutation = useSignOutMutation();
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const { control, handleSubmit } = useForm<ProfileFormInput, unknown, ProfileFormOutput>({
    resolver: valibotResolver(profileSchema),
    values: {
      fullName: profile?.fullName ?? '',
    },
  });

  const isSaving = updateProfileMutation.isPending;
  const isSigningOut = signOutMutation.isPending;

  const handleSave = async (values: ProfileFormOutput) => {
    setStatusMessage(null);

    try {
      await updateProfileMutation.mutateAsync({ fullName: values.fullName });
      setStatusMessage({ type: 'success', text: 'Profile updated.' });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: getErrorMessage(error, 'Unable to update profile.'),
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: getErrorMessage(error, 'Unable to sign out.'),
      });
    }
  };

  const displayEmail = profile?.email ?? user?.email ?? '';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-6 py-8"
        >
          <View className="w-full max-w-lg self-center gap-10">
            <View className="gap-6">
              <Text variant="title">Account</Text>

              <View className="gap-2">
                <Text variant="subtext">Email</Text>
                <View className="min-h-12 justify-center rounded-sm bg-surface px-4 py-3">
                  <Text className="text-text-secondary">{displayEmail}</Text>
                </View>
              </View>

              <FormTextField
                control={control}
                name="fullName"
                label="Full name"
                placeholder="Add your name"
                autoCapitalize="words"
                editable={!isSaving}
                accessibilityLabel="Full name"
              />

              {statusMessage ? (
                <FeedbackBanner
                  variant={statusMessage.type === 'error' ? 'error' : 'status'}
                  message={statusMessage.text}
                />
              ) : null}

              <Button
                onPress={() => {
                  void handleSubmit(handleSave)();
                }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={THEME.primaryForeground} />
                ) : (
                  <Text>Save profile</Text>
                )}
              </Button>
            </View>

            <View className="gap-6">
              <Text variant="title">Session</Text>

              <View className="gap-4">
                <View className="gap-1">
                  <Text variant="subtext">User ID</Text>
                  <Text selectable>{user?.id ?? '—'}</Text>
                </View>

                {profile?.createdAt ? (
                  <View className="gap-1">
                    <Text variant="subtext">Member since</Text>
                    <Text>{new Date(profile.createdAt).toLocaleDateString()}</Text>
                  </View>
                ) : null}
              </View>

              <Button variant="secondary" onPress={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? (
                  <ActivityIndicator color={THEME.foreground} />
                ) : (
                  <Text>Sign out</Text>
                )}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
