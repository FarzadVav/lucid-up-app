import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { DEFAULT_CATEGORY_TITLE } from '@/features/journals/domain/constants';
import type { Category } from '@/features/journals/domain/entities/category';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { AppIcon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { THEME } from '@/shared/lib/theme';
import { cn } from '@/shared/lib/utils';

type CategoryPickerProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  disabled?: boolean;
  allowClear?: boolean;
  errorMessage?: string;
};

export function CategoryPicker({
  categories,
  selectedCategoryId,
  onSelectCategory,
  disabled = false,
  allowClear = false,
  errorMessage,
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? null;

  return (
    <View className="gap-2">
      <Pressable
        onPress={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Category"
        accessibilityState={{ disabled }}
        className={cn(
          'min-h-12 w-full flex-row items-center justify-between rounded-sm bg-surface px-4 py-3 active:bg-surface-muted',
          disabled && 'opacity-50'
        )}
      >
        <Text className={selectedCategory ? 'text-foreground' : 'text-text-secondary'}>
          {selectedCategory
            ? selectedCategory.title
            : `Select a category (defaults to ${DEFAULT_CATEGORY_TITLE})`}
        </Text>
        <AppIcon name="chevronDown" size={18} color={THEME.textSecondary} />
      </Pressable>

      {errorMessage ? (
        <Text variant="subtext" className="text-accent-foreground" accessibilityRole="alert">
          {errorMessage}
        </Text>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Category</DialogTitle>
          </DialogHeader>

          <ScrollView style={{ maxHeight: 280 }} keyboardShouldPersistTaps="handled">
            <View className="gap-2">
              {allowClear ? (
                <Pressable
                  onPress={() => {
                    onSelectCategory(null);
                    setOpen(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedCategoryId === null }}
                  className={cn(
                    'min-h-12 flex-row items-center justify-between rounded-sm px-4 py-3 active:opacity-85',
                    selectedCategoryId === null ? 'bg-accent-soft' : 'bg-surface-muted'
                  )}
                >
                  <Text
                    className={
                      selectedCategoryId === null ? 'text-accent-foreground' : 'text-text-secondary'
                    }
                  >
                    No selection (use {DEFAULT_CATEGORY_TITLE})
                  </Text>
                  {selectedCategoryId === null ? (
                    <AppIcon name="check" size={18} color={THEME.accentForeground} />
                  ) : null}
                </Pressable>
              ) : null}

              {categories.map((category) => {
                const isSelected = category.id === selectedCategoryId;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => {
                      onSelectCategory(category.id);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={cn(
                      'min-h-12 flex-row items-center justify-between rounded-sm px-4 py-3 active:opacity-85',
                      isSelected ? 'bg-accent-soft' : 'bg-surface-muted'
                    )}
                  >
                    <Text className={isSelected ? 'text-accent-foreground' : 'text-foreground'}>
                      {category.title}
                    </Text>
                    {isSelected ? (
                      <AppIcon name="check" size={18} color={THEME.accentForeground} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" accessibilityLabel="Cancel">
                <Text>Cancel</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
