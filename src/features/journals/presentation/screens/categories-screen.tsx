import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEFAULT_CATEGORY_TITLE } from '@/features/journals/domain/constants';
import type { Category } from '@/features/journals/domain/entities/category';
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from '@/features/journals/presentation/hooks/use-categories';
import { Button } from '@/shared/components/ui/button';
import { Card, SwipeableCard } from '@/shared/components/ui/card';
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { FeedbackBanner } from '@/shared/components/ui/feedback-banner';
import { AppIcon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { TopBar } from '@/shared/components/ui/top-bar';
import { THEME } from '@/shared/lib/theme';
import { getErrorMessage } from '@/shared/utils/errors';

export function CategoriesScreen() {
  const {
    data: categories = [],
    isLoading,
    error: queryError,
    refetch,
  } = useCategoriesQuery();
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const errorMessage =
    actionError ??
    (queryError ? getErrorMessage(queryError, 'Unable to load categories.') : null);

  const isDeleting = deleteCategoryMutation.isPending;

  const handleConfirmDelete = async () => {
    if (!categoryToDelete || categoryToDelete.isDefault || isDeleting) {
      return;
    }

    setActionError(null);
    setStatusMessage(null);

    try {
      const result = await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      const movedText =
        result.movedJournalsCount > 0
          ? ` ${result.movedJournalsCount} journal${result.movedJournalsCount === 1 ? '' : 's'} moved to ${DEFAULT_CATEGORY_TITLE}.`
          : '';
      setStatusMessage(`Category "${categoryToDelete.title}" deleted.${movedText}`);
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to delete category.'));
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <TopBar
        title="Journals"
        rightAction={
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Profile"
            className="min-h-12 min-w-12 items-center justify-center rounded-full active:bg-surface"
          >
            <AppIcon name="profile" size={22} color={THEME.foreground} />
          </Pressable>
        }
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color={THEME.foreground} />
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
                        void refetch();
                      }
                    : undefined
                }
              />
            ) : null}

            {statusMessage ? <FeedbackBanner variant="status" message={statusMessage} /> : null}

            {categories.length === 0 ? (
              <View className="gap-3 rounded-md bg-surface p-6">
                <Text variant="title">No categories yet</Text>
                <Text className="text-text-secondary">
                  Create a category to start organizing your journal entries.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {categories.map((category) => {
                  const isDefault = category.isDefault;
                  return (
                    <SwipeableCard
                      key={category.id}
                      enabled={!isDefault}
                      actions={
                        isDefault
                          ? []
                          : [
                              {
                                key: 'edit',
                                label: 'Edit',
                                variant: 'secondary',
                                accessibilityLabel: `Edit ${category.title}`,
                                icon: <AppIcon name="edit" size={20} color={THEME.foreground} />,
                                onPress: () => {
                                  setStatusMessage(null);
                                  router.push({
                                    pathname: '/journals/categories/new',
                                    params: { editId: category.id },
                                  });
                                },
                              },
                              {
                                key: 'delete',
                                label: 'Delete',
                                variant: 'accent',
                                accessibilityLabel: `Delete ${category.title}`,
                                icon: (
                                  <AppIcon
                                    name="delete"
                                    size={20}
                                    color={THEME.accentForeground}
                                  />
                                ),
                                onPress: () => {
                                  setStatusMessage(null);
                                  setCategoryToDelete(category);
                                },
                              },
                            ]
                      }
                    >
                      <Pressable
                        onPress={() => {
                          router.push({
                            pathname: '/journals/categories/[categoryId]',
                            params: { categoryId: category.id },
                          });
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={category.title}
                        className="active:opacity-85"
                      >
                        <Card>
                          <Text>{category.title}</Text>
                        </Card>
                      </Pressable>
                    </SwipeableCard>
                  );
                })}
              </View>
            )}

            <View className="gap-2 pt-2">
              <Button
                variant="ghost"
                className="justify-start px-2"
                onPress={() => router.push('/journals/categories/new')}
                accessibilityLabel="New Category"
              >
                <AppIcon name="add" size={18} color={THEME.accentForeground} />
                <Text className="text-accent-foreground">New Category</Text>
              </Button>

              <Button
                variant="ghost"
                className="justify-start px-2"
                onPress={() => router.push('/journals/new')}
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
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setCategoryToDelete(null);
          }
        }}
        title="Delete category?"
        description={
          categoryToDelete
            ? `Journals inside "${categoryToDelete.title}" will be moved to "${DEFAULT_CATEGORY_TITLE}" before this category is deleted.`
            : undefined
        }
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        confirmVariant="accent"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </SafeAreaView>
  );
}
