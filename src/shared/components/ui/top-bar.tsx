import { Pressable, View } from 'react-native';
import { AppIcon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { THEME } from '@/shared/lib/theme';

type TopBarProps = {
  title?: string;
  onBack?: () => void;
  backLabel?: string;
  rightAction?: React.ReactNode;
};

/**
 * Calm, borderless top navigation bar with a leading back slot,
 * centered title, and optional trailing action.
 */
export function TopBar({ title, onBack, backLabel = 'Back', rightAction }: TopBarProps) {
  return (
    <View className="w-full max-w-lg flex-row items-center justify-between self-center bg-background px-6 py-3">
      <View className="min-w-12 items-start">
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            className="min-h-12 min-w-12 items-center justify-center rounded-full active:bg-surface"
          >
            <AppIcon name="back" size={22} color={THEME.foreground} />
          </Pressable>
        ) : null}
      </View>

      <View className="flex-1 items-center justify-center px-2">
        {title ? (
          <Text variant="text" className="font-semibold" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      <View className="min-w-12 items-end">{rightAction ?? null}</View>
    </View>
  );
}
