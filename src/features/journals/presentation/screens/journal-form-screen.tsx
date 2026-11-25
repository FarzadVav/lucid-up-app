import { valibotResolver } from '@hookform/resolvers/valibot';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEFAULT_CATEGORY_TITLE } from '@/features/journals/domain/constants';
import {
  createJournalFormSchema,
  type JournalFormInput,
  type JournalFormOutput,
} from '@/features/journals/domain/schemas/journal-schema';
import { CategoryPicker } from '@/features/journals/presentation/components/category-picker';
import { useCategoriesQuery } from '@/features/journals/presentation/hooks/use-categories';
import {
  useCreateJournalMutation,
  useJournalQuery,
  useUpdateJournalMutation,
} from '@/features/journals/presentation/hooks/use-journals';
import { FormTextField } from '@/shared/components/form/form-field';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { FeedbackBanner } from '@/shared/components/ui/feedback-banner';
import { Text } from '@/shared/components/ui/text';
import { TopBar } from '@/shared/components/ui/top-bar';
import { THEME } from '@/shared/lib/theme';
import { getErrorMessage } from '@/shared/utils/errors';
import { isValidUuid, normalizeRouteParam } from '@/shared/utils/params';

export function JournalFormScreen() {
  const params = useLocalSearchParams<{
    editId?: string | string[];
    categoryId?: string | string[];
    from?: string | string[];
  }>();
  const editId = normalizeRouteParam(params.editId);
  const preselectedCategoryId = normalizeRouteParam(params.categoryId);
  const from = normalizeRouteParam(params.from);

  return (
    <JournalFormContent
      key={`${editId ?? 'create'}:${preselectedCategoryId ?? 'none'}`}
      editId={editId}
      preselectedCategoryId={preselectedCategoryId}
      from={from}
    />
  );
}

function JournalFormContent({
  editId,
  preselectedCategoryId,
  from,
}: {
  editId: string | null;
  preselectedCategoryId: string | null;
  from: string | null;
}) {
  const isEditMode = editId !== null;
  const hasValidEditId = !isEditMode || isValidUuid(editId);
  const hasValidPreselectedCategory =
    preselectedCategoryId === null || isValidUuid(preselectedCategoryId);

  const categoriesQuery = useCategoriesQuery();
  const journalQuery = useJournalQuery(isEditMode ? editId : null);
  const createJournalMutation = useCreateJournalMutation();
  const updateJournalMutation = useUpdateJournalMutation();

  const [pendingValues, setPendingValues] = useState<JournalFormOutput | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories = categoriesQuery.data ?? [];
  const existingJournal = journalQuery.data ?? null;

  const formSchema = useMemo(() => createJournalFormSchema(isEditMode), [isEditMode]);

  const initialValues = useMemo<JournalFormInput>(
    () => ({
      title: existingJournal?.title ?? '',
      content: existingJournal?.content ?? '',
      categoryId: isEditMode
        ? (existingJournal?.categoryId ?? null)
        : preselectedCategoryId,
    }),
    [existingJournal, isEditMode, preselectedCategoryId]
  );

  const { control, handleSubmit } = useForm<JournalFormInput, unknown, JournalFormOutput>({
    resolver: valibotResolver(formSchema),
    values: initialValues,
  });

  const isLoading =
    categoriesQuery.isLoading || (isEditMode && hasValidEditId && journalQuery.isLoading);
  const isSaving = createJournalMutation.isPending || updateJournalMutation.isPending;

  let loadError: string | null = null;
  if (categoriesQuery.error) {
    loadError = getErrorMessage(categoriesQuery.error, 'Unable to load journal form.');
  } else if (isEditMode) {
    if (!hasValidEditId) {
      loadError = 'Invalid journal identifier.';
    } else if (journalQuery.error) {
      loadError = getErrorMessage(journalQuery.error, 'Unable to load journal form.');
    } else if (!journalQuery.isLoading && !existingJournal) {
      loadError = 'Journal not found or you do not have access to it.';
    }
  } else if (preselectedCategoryId !== null) {
    if (!hasValidPreselectedCategory) {
      loadError = 'Invalid category identifier.';
    } else if (
      !categoriesQuery.isLoading &&
      !categories.some((item) => item.id === preselectedCategoryId)
    ) {
      loadError = 'Selected category was not found or is unavailable.';
    }
  }

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/journals');
    }
  };

  const handleRequestSave = (values: JournalFormOutput) => {
    setSubmitError(null);
    setPendingValues(values);
  };

  const handleConfirmSave = async () => {
    if (isSaving || !pendingValues) {
      return;
    }

    setSubmitError(null);

    try {
      const savedJournal = isEditMode
        ? await updateJournalMutation.mutateAsync({
            journalId: editId!,
            title: pendingValues.title,
            content: pendingValues.content,
            categoryId: pendingValues.categoryId,
          })
        : await createJournalMutation.mutateAsync({
            title: pendingValues.title,
            content: pendingValues.content,
            categoryId: pendingValues.categoryId,
          });

      setPendingValues(null);
      if (isEditMode && from === 'detail' && router.canGoBack()) {
        router.back();
      } else {
        router.replace({
          pathname: '/journals/[journalId]',
          params: { journalId: savedJournal.id },
        });
      }
    } catch (error) {
      setPendingValues(null);
      setSubmitError(getErrorMessage(error, 'Unable to save journal.'));
    }
  };

  const pendingCategoryTitle =
    categories.find((item) => item.id === pendingValues?.categoryId)?.title ??
    DEFAULT_CATEGORY_TITLE;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <TopBar
        title={isEditMode ? 'Edit Journal' : 'New Journal'}
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
                placeholder="Enter journal title"
                editable={!isSaving}
                accessibilityLabel="Journal title"
              />

              <Controller
                control={control}
                name="categoryId"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View className="gap-2">
                    <Text variant="subtext">Category</Text>
                    <CategoryPicker
                      categories={categories}
                      selectedCategoryId={value}
                      onSelectCategory={onChange}
                      disabled={isSaving}
                      allowClear={!isEditMode}
                      errorMessage={error?.message}
                    />
                  </View>
                )}
              />

              <FormTextField
                control={control}
                name="content"
                label="Content"
                placeholder="Write your journal entry..."
                multiline
                editable={!isSaving}
                style={{ minHeight: 180, textAlignVertical: 'top' }}
                accessibilityLabel="Journal content"
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
        title={isEditMode ? 'Save journal changes?' : 'Save journal?'}
        description={
          pendingValues
            ? isEditMode
              ? `Save changes to "${pendingValues.title}" in "${pendingCategoryTitle}".`
              : `Save "${pendingValues.title}" to "${pendingCategoryTitle}".`
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
