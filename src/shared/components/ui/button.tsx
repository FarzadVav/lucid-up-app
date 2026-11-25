import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';
import { TextClassContext } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-md',
    Platform.select({
      web: 'whitespace-nowrap outline-none transition-opacity',
    })
  ),
  {
    variants: {
      variant: {
        default: cn('bg-primary active:opacity-85', Platform.select({ web: 'hover:opacity-90' })),
        secondary: cn(
          'bg-surface-muted active:opacity-80',
          Platform.select({ web: 'hover:opacity-90' })
        ),
        accent: cn(
          'bg-accent-soft active:opacity-80',
          Platform.select({ web: 'hover:opacity-90' })
        ),
        ghost: cn(
          'bg-transparent active:bg-surface',
          Platform.select({ web: 'hover:bg-surface' })
        ),
      },
      size: {
        default: 'min-h-12 px-6 py-3',
        sm: 'min-h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('text-text', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-foreground',
      accent: 'text-accent-foreground',
      ghost: 'text-text-secondary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, disabled, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant })}>
      <Pressable
        className={cn(
          disabled && 'opacity-50',
          Platform.select({ web: disabled && 'pointer-events-none' }),
          buttonVariants({ variant, size }),
          className
        )}
        disabled={disabled}
        role="button"
        accessibilityState={{ disabled: Boolean(disabled), ...props.accessibilityState }}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
