import { useState } from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Text, TextClassContext, type TextProps } from '@/shared/components/ui/text';
import { cn } from '@/shared/lib/utils';

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

type SwipeableCardAction = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  variant?: 'secondary' | 'accent';
  accessibilityLabel?: string;
};

type SwipeableCardProps = Omit<
  React.ComponentProps<typeof View> & React.RefAttributes<View>,
  'children'
> & {
  children: React.ReactNode;
  actions: SwipeableCardAction[];
  enabled?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

const SWIPE_SPRING_CONFIG = {
  damping: 24,
  stiffness: 240,
  mass: 0.8,
};

/**
 * Swipeable wrapper for React Native Reusables `Card`, powered by
 * `react-native-reanimated` and `react-native-gesture-handler` to reveal
 * contextual actions.
 */
function SwipeableCard({
  children,
  actions,
  enabled = true,
  onOpenChange,
  className,
  ...props
}: SwipeableCardProps) {
  const isRTL = I18nManager.isRTL;
  const [actionsWidth, setActionsWidth] = useState(Math.max(actions.length * 60, 60));
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const isSwipeEnabled = enabled && actions.length > 0;
  const direction = isRTL ? 1 : -1;
  const openOffset = direction * actionsWidth;

  const notifyOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

  const close = () => {
    translateX.value = withSpring(0, SWIPE_SPRING_CONFIG);
    onOpenChange?.(false);
  };

  const panGesture = Gesture.Pan()
    .enabled(isSwipeEnabled)
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const next = startX.value + event.translationX;
      if (isRTL) {
        translateX.value = Math.max(0, Math.min(actionsWidth, next));
      } else {
        translateX.value = Math.min(0, Math.max(-actionsWidth, next));
      }
    })
    .onEnd((event) => {
      const projected = translateX.value + event.velocityX * 0.1;
      const shouldOpen = isRTL
        ? projected > actionsWidth * 0.4
        : projected < -actionsWidth * 0.4;

      translateX.value = withSpring(shouldOpen ? openOffset : 0, SWIPE_SPRING_CONFIG);
      runOnJS(notifyOpenChange)(shouldOpen);
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!isSwipeEnabled) {
    return (
      <View className={cn('relative overflow-hidden rounded-md', className)} {...props}>
        {children}
      </View>
    );
  }

  return (
    <View className={cn('relative overflow-hidden rounded-md', className)} {...props}>
      <View
        className="absolute inset-y-0 end-0 flex-row items-center gap-2 pe-2 ps-2"
        onLayout={(event) => {
          const width = Math.ceil(event.nativeEvent.layout.width);
          if (width > 0 && width !== actionsWidth) {
            setActionsWidth(width);
          }
        }}
      >
        {actions.map((action) => {
          const isAccent = action.variant === 'accent';
          return (
            <Pressable
              key={action.key}
              onPress={() => {
                close();
                action.onPress();
              }}
              role="button"
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel ?? action.label}
              className={cn(
                'min-h-12 min-w-12 items-center justify-center rounded-sm active:opacity-80',
                action.icon ? 'px-3 py-3' : 'px-4 py-3',
                isAccent ? 'bg-accent-soft' : 'bg-surface-muted'
              )}
            >
              {action.icon ?? (
                <Text
                  variant="subtext"
                  className={cn(isAccent ? 'text-accent-foreground' : 'text-foreground')}
                >
                  {action.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedCardStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SwipeableCard,
};
export type { SwipeableCardAction, SwipeableCardProps };
