import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Journal } from '@/features/journals/domain/entities/journal';
import { useCategoryQuery } from '@/features/journals/presentation/hooks/use-categories';
import {
  useDeleteJournalMutation,
  useJournalsByCategoryQuery,
} from '@/features/journals/presentation/hooks/use-journals';
import { Button } from '@/shared/components/ui/button';
import { Card, SwipeableCard } from '@/shared/components/ui/card';
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { FeedbackBanner } from '@/shared/components/ui/feedback-banner';
import { AppIcon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { TopBar } from '@/shared/components/ui/top-bar';
import { THEME } from '@/shared/lib/theme';
import { formatJournalDateTime } from '@/shared/utils/dates';
import { getErrorMessage } from '@/shared/utils/errors';
import { isValidUuid, normalizeRouteParam } from '@/shared/utils/params';

export function CategoryDetailScreen() {
  const params = useLocalSearchParams<{ categoryId?: string | string[] }>();
  const categoryId = normalizeRouteParam(params.categoryId);
  const hasValidCategoryId = isValidUuid(categoryId);

  const categoryQuery = useCategoryQuery(categoryId);
  const journalsQuery = useJournalsByCategoryQuery(categoryId);
  const deleteJournalMutation = useDeleteJournalMutation();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [journalToDelete, setJournalToDelete] = useState<Journal | null>(null);

  const category = categoryQuery.data ?? null;
  const journals = journalsQuery.data ?? [];
  const isLoading = hasValidCategoryId && (categoryQuery.isLoading || journalsQuery.isLoading);
  const isDeleting = deleteJournalMutation.isPending;

  const queryError = categoryQuery.error ?? journalsQuery.error;
  const errorMessage = !hasValidCategoryId
    ? 'Invalid category identifier.'
    : actionError ??
      (queryError ? getErrorMessage(queryError, 'Unable to load category.') : null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/journals');
    }
  };

  const handleConfirmDeleteJournal = async () => {
    if (!journalToDelete || isDeleting) {
      return;
    }

    setActionError(null);
    setStatusMessage(null);

    try {
      await deleteJournalMutation.mutateAsync(journalToDelete.id);
      setStatusMessage(`Journal "${journalToDelete.title}" deleted.`);
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to delete journal.'));
    } finally {
      setJournalToDelete(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <TopBar
        title={category?.title ?? 'Category'}
        onBack={handleBack}
        rightAction={
          category && !category.isDefault ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/journals/categories/new',
                  params: { editId: category.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Edit category"
              className="min-h-12 min-w-12 items-center justify-center rounded-full active:bg-surface"
            >
              <AppIcon name="edit" size={20} color={THEME.foreground} />
            </Pressable>
          ) : null
        }
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color={THEME.foreground} />
        </View>
      ) : !category ? (
        <View className="flex-1 justify-center px-6">
          <View className="w-full max-w-lg self-center gap-6">
            <FeedbackBanner
              variant="error"
              message={errorMessage ?? 'Category not found or you do not have access to it.'}
            />
            <Button variant="secondary" onPress={() => router.replace('/journals')}>
              <Text>Back to Journals</Text>
            </Button>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerClassName="px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-lg self-center gap-8">
            {errorMessage ? (
              <FeedbackBanner
                variant="error"
                message={errorMessage}
                onRetry={
                  queryError
                    ? () => {
                        setActionError(null);
                        void Promise.all([categoryQuery.refetch(), journalsQuery.refetch()]);
                      }
                    : undefined
                }
              />
            ) : null}

            {statusMessage ? <FeedbackBanner variant="status" message={statusMessage} /> : null}

            {journals.length === 0 ? (
              <View className="gap-3 rounded-md bg-surface p-6">
                <Text variant="title">No journals yet</Text>
                <Text className="text-text-secondary">
                  This category has no entries yet. Tap New Journal below to write one.
                </Text>
              </View>
            ) : (
              <View className="gap-4">
                {journals.map((journal) => (
                  <SwipeableCard
                    key={journal.id}
                    actions={[
                      {
                        key: 'edit',
                        label: 'Edit',
                        variant: 'secondary',
                        accessibilityLabel: `Edit ${journal.title}`,
                        icon: <AppIcon name="edit" size={20} color={THEME.foreground} />,
                        onPress: () => {
                          setStatusMessage(null);
                          router.push({
                            pathname: '/journals/new',
                            params: { editId: journal.id },
                          });
                        },
                      },
                      {
                        key: 'delete',
                        label: 'Delete',
                        variant: 'accent',
                        accessibilityLabel: `Delete ${journal.title}`,
                        icon: (
                          <AppIcon name="delete" size={20} color={THEME.accentForeground} />
                        ),
                        onPress: () => {
                          setStatusMessage(null);
                          setJournalToDelete(journal);
                        },
                      },
                    ]}
                  >
                    <Pressable
                      onPress={() => {
                        router.push({
                          pathname: '/journals/[journalId]',
                          params: { journalId: journal.id },
                        });
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={journal.title}
                      className="active:opacity-85"
                    >
                      <Card className="gap-2">
                        <Text className="font-semibold">{journal.title}</Text>
                        <View className="gap-1">
                          <Text variant="subtext">
                            Created {formatJournalDateTime(journal.createdAt)}
                          </Text>
                          <Text variant="subtext">
                            Updated {formatJournalDateTime(journal.updatedAt)}
                          </Text>
                        </View>
                      </Card>
                    </Pressable>
                  </SwipeableCard>
                ))}
              </View>
            )}

            <View className="pt-2">
              <Button
                variant="ghost"
                className="justify-start px-2"
                onPress={() =>
                  router.push({
                    pathname: '/journals/new',
                    params: { categoryId: category.id },
                  })
                }
                accessibilityLabel="New Journal"
              >
                <AppIcon name="add" size={18} color={THEME.accentForeground} />
                <Text className="text-accent-foreground">New Journal</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      )}

      <ConfirmDialog
        open={Boolean(journalToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setJournalToDelete(null);
          }
        }}
        title="Delete journal?"
        description={
          journalToDelete
            ? `Are you sure you want to delete "${journalToDelete.title}"? This action cannot be undone.`
            : undefined
        }
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        confirmVariant="accent"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDeleteJournal}
        onCancel={() => setJournalToDelete(null)}
      />
    </SafeAreaView>
  );
}
