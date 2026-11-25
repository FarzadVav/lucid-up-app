import { View } from 'react-native';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/utils';

type FeedbackBannerProps = {
  variant?: 'error' | 'status';
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

/**
 * Calm, borderless banner for inline errors and confirmation feedback.
 */
export function FeedbackBanner({
  variant = 'error',
  message,
  onRetry,
  retryLabel = 'Retry',
  className,
}: FeedbackBannerProps) {
  const isError = variant === 'error';

  return (
    <View
      className={cn(
        'gap-3 rounded-sm p-4',
        isError ? 'bg-surface-muted' : 'bg-accent-soft',
        className
      )}
      accessibilityRole={isError ? 'alert' : 'text'}
    >
      <Text
        variant="subtext"
        className={isError ? 'text-foreground' : 'text-accent-foreground'}
      >
        {message}
      </Text>
      {onRetry ? (
        <Button variant="secondary" size="sm" onPress={onRetry}>
          <Text>{retryLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}
