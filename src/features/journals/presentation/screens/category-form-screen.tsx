import { valibotResolver } from '@hookform/resolvers/valibot';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEFAULT_CATEGORY_TITLE } from '@/features/journals/domain/constants';
import {
  categoryFormSchema,
  type CategoryFormInput,
  type CategoryFormOutput,
} from '@/features/journals/domain/schemas/category-schema';
import {
  useCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/features/journals/presentation/hooks/use-categories';
import { FormTextField } from '@/shared/components/form/form-field';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { FeedbackBanner } from '@/shared/components/ui/feedback-banner';
import { Text } from '@/shared/components/ui/text';
import { TopBar } from '@/shared/components/ui/top-bar';
import { THEME } from '@/shared/lib/theme';
import { getErrorMessage } from '@/shared/utils/errors';
import { isValidUuid, normalizeRouteParam } from '@/shared/utils/params';

export function CategoryFormScreen() {
  const params = useLocalSearchParams<{ editId?: string | string[] }>();
  const editId = normalizeRouteParam(params.editId);

  return <CategoryFormContent key={editId ?? 'create'} editId={editId} />;
}

function CategoryFormContent({ editId }: { editId: string | null }) {
  const isEditMode = editId !== null;
  const hasValidEditId = !isEditMode || isValidUuid(editId);

  const categoryQuery = useCategoryQuery(isEditMode ? editId : null);
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();

  const [pendingValues, setPendingValues] = useState<CategoryFormOutput | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const existingCategory = categoryQuery.data ?? null;

  const { control, handleSubmit } = useForm<CategoryFormInput, unknown, CategoryFormOutput>({
    resolver: valibotResolver(categoryFormSchema),
    values: {
      title: existingCategory?.title ?? '',
    },
  });

  const isLoading = isEditMode && hasValidEditId && categoryQuery.isLoading;
  const isSaving = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  let loadError: string | null = null;
  if (isEditMode) {
    if (!hasValidEditId) {
      loadError = 'Invalid category identifier.';
    } else if (categoryQuery.error) {
      loadError = getErrorMessage(categoryQuery.error, 'Unable to load category.');
    } else if (!categoryQuery.isLoading && !existingCategory) {
      loadError = 'Category not found or you do not have access to it.';
    } else if (existingCategory?.isDefault) {
      loadError = `The default category "${DEFAULT_CATEGORY_TITLE}" cannot be edited.`;
    }
  }

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/journals');
    }
  };

  const handleRequestSave = (values: CategoryFormOutput) => {
    setSubmitError(null);
    if (isEditMode && (!existingCategory || existingCategory.isDefault)) {
      setSubmitError('This category cannot be edited.');
      return;
    }
    setPendingValues(values);
  };

  const handleConfirmSave = async () => {
    if (isSaving || !pendingValues) {
      return;
    }

    setSubmitError(null);

    try {
      if (isEditMode) {
        if (!existingCategory || existingCategory.isDefault) {
          throw new Error('This category cannot be edited.');
        }

        const updated = await updateCategoryMutation.mutateAsync({
          categoryId: existingCategory.id,
          title: pendingValues.title,
        });
        setPendingValues(null);
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace({
            pathname: '/journals/categories/[categoryId]',
            params: { categoryId: updated.id },
          });
        }
        return;
      }

      await createCategoryMutation.mutateAsync(pendingValues.title);
      setPendingValues(null);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/journals');
      }
    } catch (error) {
      setPendingValues(null);
      setSubmitError(getErrorMessage(error, 'Unable to save category.'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <TopBar
        title={isEditMode ? 'Edit Category' : 'New Category'}
        onBack={handleBack}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color={THEME.foreground} />
        </View>
      ) : loadError ? (
        <View className="flex-1 justify-center px-6">
          <View className="w-full max-w-lg self-center gap-6">
            <FeedbackBanner variant="error" message={loadError} />
            <Button variant="secondary" onPress={handleBack}>
              <Text>Back</Text>
            </Button>
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="px-6 py-8"
          >
            <View className="w-full max-w-lg self-center gap-6">
              <FormTextField
                control={control}
                name="title"
                label="Title"
                placeholder="Enter category title"
                editable={!isSaving}
                returnKeyType="done"
                onSubmitEditing={() => {
                  void handleSubmit(handleRequestSave)();
                }}
                accessibilityLabel="Category title"
              />

              {submitError ? <FeedbackBanner variant="error" message={submitError} /> : null}

              <Button
                onPress={() => {
                  void handleSubmit(handleRequestSave)();
                }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={THEME.primaryForeground} />
                ) : (
                  <Text>Save</Text>
                )}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      <ConfirmDialog
        open={pendingValues !== null}
        onOpenChange={(open) => {
          if (!open && !isSaving) {
            setPendingValues(null);
          }
        }}
        title={isEditMode ? 'Save category changes?' : 'Create category?'}
        description={
          pendingValues
            ? isEditMode
              ? `Update category title to "${pendingValues.title}".`
              : `Create a new category named "${pendingValues.title}".`
            : undefined
        }
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        isConfirming={isSaving}
        onConfirm={handleConfirmSave}
        onCancel={() => setPendingValues(null)}
      />
    </SafeAreaView>
  );
}
