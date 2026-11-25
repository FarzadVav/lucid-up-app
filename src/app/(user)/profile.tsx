import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{displayEmail}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={(value) => {
                setDraftFullName(value);
                if (statusMessage) setStatusMessage(null);
              }}
              placeholder="Add your name"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              editable={!isSaving}
              style={styles.input}
            />
          </View>

          {statusMessage ? (
            <View
              style={[
                styles.statusBox,
                statusMessage.type === 'error' ? styles.errorBox : styles.successBox,
              ]}
            >
              <Text
                style={statusMessage.type === 'error' ? styles.errorText : styles.successText}
              >
                {statusMessage.text}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.primaryButton,
              (pressed || isSaving) && styles.buttonDisabled,
            ]}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Save profile</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>User ID</Text>
            <Text style={styles.metaValue} selectable>
              {user?.id ?? '—'}
            </Text>
          </View>
          {profile?.created_at ? (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Member since</Text>
              <Text style={styles.metaValue}>
                {new Date(profile.created_at).toLocaleDateString()}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleSignOut}
            disabled={isSigningOut}
            style={({ pressed }) => [
              styles.signOutButton,
              (pressed || isSigningOut) && styles.buttonDisabled,
            ]}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#B91C1C" />
            ) : (
              <Text style={styles.signOutButtonText}>Sign out</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    gap: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  readOnlyField: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  readOnlyText: {
    fontSize: 15,
    color: '#475569',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  statusBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  successBox: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  successText: {
    color: '#15803D',
    fontSize: 14,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  metaRow: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 14,
    color: '#0F172A',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  signOutButtonText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
