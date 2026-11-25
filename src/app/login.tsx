import { Redirect } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          <Text style={styles.eyebrow}>LUCID UP</Text>
          <Text style={styles.title}>Sign in with Email</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we will send you a magic link to sign in without a
            password.
          </Text>

          {displayError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          {sentToEmail ? (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successText}>
                We sent a magic link to <Text style={styles.bold}>{sentToEmail}</Text>. Open the
                link on this device to finish signing in.
              </Text>

              <Pressable
                onPress={handleSendMagicLink}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (pressed || isSubmitting) && styles.buttonDisabled,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Resend magic link</Text>
                )}
              </Pressable>

              <Pressable onPress={handleReset} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Use a different email</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (formError) setFormError(null);
                  if (authError) clearAuthError();
                }}
                placeholder="you@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                editable={!isSubmitting}
                onSubmitEditing={handleSendMagicLink}
                returnKeyType="send"
                style={styles.input}
              />

              <Pressable
                onPress={handleSendMagicLink}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (pressed || isSubmitting) && styles.buttonDisabled,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Send magic link</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#2563EB',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 4,
  },
  form: {
    gap: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
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
  primaryButton: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    lineHeight: 20,
  },
  successBox: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginTop: 4,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#166534',
  },
  successText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#15803D',
  },
  bold: {
    fontWeight: '700',
  },
});
