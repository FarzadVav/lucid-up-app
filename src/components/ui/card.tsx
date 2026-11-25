import { View } from 'react-native';
import { Text, TextClassContext, type TextProps } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return (
    <TextClassContext.Provider value="text-foreground">
      <View className={cn('flex flex-col gap-4 rounded-md bg-surface p-6', className)} {...props} />
    </TextClassContext.Provider>
  );
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={cn('flex flex-col gap-2', className)} {...props} />;
}

function CardTitle({ className, ...props }: TextProps) {
  return <Text variant="title" className={className} {...props} />;
}

function CardDescription({ className, ...props }: TextProps) {
  return <Text variant="subtext" className={className} {...props} />;
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={cn('flex flex-col gap-4', className)} {...props} />;
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={cn('flex flex-row items-center gap-3', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
