import { useState } from 'react';
import { Platform, TextInput } from 'react-native';
import { THEME } from '@/shared/lib/theme';
import { cn } from '@/shared/lib/utils';

type InputProps = React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>;

function Input({ className, editable = true, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      editable={editable}
      keyboardAppearance="dark"
      placeholderTextColor={THEME.textSecondary}
      selectionColor={THEME.accent}
      cursorColor={THEME.accent}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      className={cn(
        'w-full min-w-0 rounded-sm px-4 py-3 text-text text-foreground',
        !props.multiline && 'min-h-12',
        isFocused ? 'bg-surface-muted' : 'bg-surface',
        !editable && 'opacity-50',
        Platform.select({
          web: 'outline-none transition-colors placeholder:text-text-secondary',
        }),
        className
      )}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
