import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { View } from 'react-native';
import { Input, type InputProps } from '@/shared/components/ui/input';
import { Text } from '@/shared/components/ui/text';

type FormTextFieldProps<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
> = Omit<InputProps, 'value' | 'onChangeText' | 'onBlur'> & {
  control: Control<TFieldValues, TContext, TTransformedValues>;
  name: FieldPath<TFieldValues>;
  label: string;
};

/**
 * Connects React Hook Form `Controller` to Lucid Up's RNR `Input` with
 * standardized label and accessible validation error messaging.
 */
export function FormTextField<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
>({
  control,
  name,
  label,
  editable = true,
  accessibilityLabel,
  ...inputProps
}: FormTextFieldProps<TFieldValues, TContext, TTransformedValues>) {
  return (
    <Controller<TFieldValues, FieldPath<TFieldValues>, TTransformedValues>
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-2">
          <Text variant="subtext">{label}</Text>
          <Input
            value={typeof value === 'string' ? value : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            editable={editable}
            accessibilityLabel={accessibilityLabel ?? label}
            {...inputProps}
          />
          {error?.message ? (
            <Text variant="subtext" className="text-accent-foreground" accessibilityRole="alert">
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
