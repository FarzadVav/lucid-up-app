import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useAuth } from '@/providers/auth-provider';

export default function ProfileScreen() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [draftFullName, setDraftFullName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fullName = draftFullName ?? profile?.full_name ?? '';

  const handleSave = async () => {
    setStatusMessage(null);
    setIsSaving(true);

    try {
      const trimmedName = fullName.trim();
      const { error } = await updateProfile({
        full_name: trimmedName.length > 0 ? trimmedName : null,
      });

      if (error) {
        setStatusMessage({ type: 'error', text: error });
        return;
      }

      setDraftFullName(null);
      setStatusMessage({ type: 'success', text: 'Profile updated.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayEmail = profile?.email ?? user?.email ?? '';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
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

            <View className="gap-2">
              <Text variant="subtext">Full name</Text>
              <Input
                value={fullName}
                onChangeText={(value) => {
                  setDraftFullName(value);
                  if (statusMessage) setStatusMessage(null);
                }}
                placeholder="Add your name"
                autoCapitalize="words"
                editable={!isSaving}
                accessibilityLabel="Full name"
              />
            </View>

            {statusMessage ? (
              <View
                className={
                  statusMessage.type === 'error'
                    ? 'rounded-sm bg-surface-muted p-4'
                    : 'rounded-sm bg-accent-soft p-4'
                }
                accessibilityRole={statusMessage.type === 'error' ? 'alert' : 'text'}
              >
                <Text
                  variant="subtext"
                  className={
                    statusMessage.type === 'error'
                      ? 'text-foreground'
                      : 'text-accent-foreground'
                  }
                >
                  {statusMessage.text}
                </Text>
              </View>
            ) : null}

            <Button onPress={handleSave} disabled={isSaving}>
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

              {profile?.created_at ? (
                <View className="gap-1">
                  <Text variant="subtext">Member since</Text>
                  <Text>{new Date(profile.created_at).toLocaleDateString()}</Text>
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
    </SafeAreaView>
  );
}
