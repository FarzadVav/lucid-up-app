import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import { THEME } from '@/shared/lib/theme';

const ICON_MAP = {
  add: { ios: 'plus', android: 'add', web: 'add' },
  back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  chevronDown: {
    ios: 'chevron.down',
    android: 'keyboard_arrow_down',
    web: 'keyboard_arrow_down',
  },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  delete: { ios: 'trash', android: 'delete', web: 'delete' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  profile: { ios: 'person.circle', android: 'person', web: 'person' },
} as const satisfies Record<string, { ios: SFSymbol; android: AndroidSymbol; web: AndroidSymbol }>;

export type AppIconName = keyof typeof ICON_MAP;

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
};

export function AppIcon({ name, size = 20, color = THEME.foreground }: AppIconProps) {
  return <SymbolView name={ICON_MAP[name]} size={size} tintColor={color} />;
}
