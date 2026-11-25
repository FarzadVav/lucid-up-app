import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useDeleteJournalMutation,
  useJournalQuery,
} from '@/features/journals/presentation/hooks/use-journals';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { FeedbackBanner } from '@/shared/components/ui/feedback-banner';
import { Text } from '@/shared/components/ui/text';
import { TopBar } from '@/shared/components/ui/top-bar';
import { THEME } from '@/shared/lib/theme';
import { getErrorMessage } from '@/shared/utils/errors';
import { isValidUuid, normalizeRouteParam } from '@/shared/utils/params';

export function JournalDetailScreen() {
  const params = useLocalSearchParams<{ journalId?: string | string[] }>();
  const journalId = normalizeRouteParam(params.journalId);
  const hasValidJournalId = isValidUuid(journalId);

  const journalQuery = useJournalQuery(journalId);
  const deleteJournalMutation = useDeleteJournalMutation();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const journal = journalQuery.data ?? null;
  const isLoading = hasValidJournalId && journalQuery.isLoading;
  const isDeleting = deleteJournalMutation.isPending;

  const errorMessage = !hasValidJournalId
    ? 'Invalid journal identifier.'
    : actionError ??
      (journalQuery.error
        ? getErrorMessage(journalQuery.error, 'Unable to load journal.')
        : null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (journal) {
      router.replace({
        pathname: '/journals/categories/[categoryId]',
        params: { categoryId: journal.categoryId },
      });
    } else {
      router.replace('/journals');
    }
  };

  const handleConfirmDelete = async () => {
    if (!journal || isDeleting) {
      return;
    }

    setActionError(null);

    try {
      await deleteJournalMutation.mutateAsync(journal.id);
      setShowDeleteConfirm(false);
      router.dismissTo({
        pathname: '/journals/categories/[categoryId]',
        params: { categoryId: journal.categoryId },
      });
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to delete journal.'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <TopBar title="Journal" onBack={handleBack} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color={THEME.foreground} />
        </View>
      ) : !journal ? (
        <View className="flex-1 justify-center px-6">
          <View className="w-full max-w-lg self-center gap-6">
            <FeedbackBanner
              variant="error"
              message={errorMessage ?? 'Journal not found or you do not have access to it.'}
            />
            <Button variant="secondary" onPress={() => router.replace('/journals')}>
              <Text>Back to Journals</Text>
            </Button>
          </View>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView contentContainerClassName="flex-grow px-6 py-8">
            <View className="w-full max-w-lg flex-1 justify-between self-center gap-10">
              <View className="gap-6">
                {errorMessage ? <FeedbackBanner variant="error" message={errorMessage} /> : null}

                <Text variant="title" selectable>
                  {journal.title}
                </Text>

                <Text selectable>{journal.content}</Text>
              </View>

              <View className="flex-row gap-3 pt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onPress={() => {
                    router.push({
                      pathname: '/journals/new',
                      params: { editId: journal.id, from: 'detail' },
                    });
                  }}
                  disabled={isDeleting}
                  accessibilityLabel="Edit journal"
                >
                  <Text>Edit</Text>
                </Button>

                <Button
                  variant="accent"
                  className="flex-1"
                  onPress={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  accessibilityLabel="Delete journal"
                >
                  <Text>Delete</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete journal?"
        description={
          journal
            ? `Are you sure you want to delete "${journal.title}"? This action cannot be undone.`
            : undefined
        }
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        confirmVariant="accent"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}
