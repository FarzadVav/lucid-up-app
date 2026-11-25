# Design Tokens

All design tokens are centrally enforced in [tailwind.config.js](../../tailwind.config.js), [global.css](../../global.css), and [src/shared/lib/theme.ts](../../src/shared/lib/theme.ts).

---

## 1. Color Palette (Dark Mode)

Extremely restrained dark-mode palette: deep obsidian-charcoal, off-white, neutral dark grays, and very soft muted purple.

| Semantic Token | Hex | HSL (`global.css`) | Contrast Notes | Intended Usage |
|---|---|---|---|---|
| `background` | `#121016` | `260 15.8% 7.5%` | Primary dark canvas | Screen backgrounds, open reading/writing surfaces |
| `foreground` / `text-primary` | `#F5F4F7` | `260 15.8% 96.3%` | `17.24:1` on `#121016`, `15.71:1` on `#1C1A22`, `14.09:1` on `#26232D` | Primary text, titles, primary button background (`bg-primary`) |
| `surface` / `card` / `popover` | `#1C1A22` | `255 13.3% 11.8%` | Subtle lift from canvas | Inputs, grouped sections/cards, subtle containers |
| `surface-muted` / `secondary` / `muted` | `#26232D` | `258 12.5% 15.7%` | Subtle active/focus shift | Focused inputs, secondary buttons, quiet alert/error surfaces |
| `text-secondary` / `muted-foreground` | `#A6A0AE` | `266 8% 65.5%` | `7.43:1` on `#121016`, `6.77:1` on `#1C1A22`, `6.07:1` on `#26232D` | Subtext, labels, timestamps, placeholders, secondary copy |
| `accent` | `#A891C4` | `267 30.2% 66.9%` | `6.76:1` with `#121016` | Selected icons/indicators, cursor/selection highlight |
| `accent-soft` | `#282233` | `261 20% 16.7%` | Soft muted dark purple tint | Selected pills/tabs, subtle success/highlight surfaces |
| `accent-foreground` | `#D5C7E8` | `265 41.8% 84.5%` | `9.63:1` on `#282233`, `11.84:1` on `#121016` | Text/icons inside `accent-soft` surfaces, subtle accent labels |
| `primary-foreground` | `#121016` | `260 15.8% 7.5%` | `17.24:1` on `#F5F4F7` | Text/icons on primary `#F5F4F7` buttons |

### Color Rules
- Purple (`accent`, `accent-soft`, `accent-foreground`) must remain an accent, never the dominant background or primary CTA color.
- Do not add unrelated saturated colors (bright red, green, blue, yellow). Communicate errors/status via calm surfaces (`bg-surface-muted` / `bg-accent-soft`), clear copy, and accessibility roles (`accessibilityRole="alert"`).
- Always use `THEME` from `@/shared/lib/theme` when JS values are needed (e.g., `ActivityIndicator` `color`, `placeholderTextColor`, `selectionColor`, navigation `ThemeProvider`).

---

## 2. Typography System (Strictly 3 Roles)

Implemented via `fontSize` in `tailwind.config.js` and the `<Text variant="..." />` component in `src/shared/components/ui/text.tsx`. `tailwind.config.js` restricts `fontSize` to these three roles only and `fontWeight` to `normal` (`400`) and `semibold` (`600`).

| Role | Class | Size | Line Height | Weight | Purpose |
|---|---|---:|---:|---:|---|
| **Title** | `text-title` | `24px` | `32px` | `600` (`semibold`) | Page titles, major section titles, journal entry titles |
| **Text** | `text-text` | `16px` | `26px` | `400` (`normal`) | Journal body copy, descriptions, button labels, input values |
| **Subtext** | `text-subtext` | `14px` | `20px` | `400` (`normal`) | Field labels, timestamps, metadata, hints, status captions |

### Typography Rules
- Default `Text` variant is `text`.
- Preserve generous `26px` line height on `Text` for comfortable long-form reading and writing across both LTR and RTL (e.g., Persian) scripts.
- Never apply `text-left` or `text-right`; omit horizontal alignment or use natural writing direction so React Native flips alignment automatically in RTL.

---

## 3. Spacing Scale

Restricted in `tailwind.config.js` to the 8-step scale:

| Token (`SPACING`) | Tailwind Step | Value | Common Use |
|---|---|---:|---|
| `xs` | `1` | `4px` | Tight label-to-value metadata spacing |
| `sm` | `2` | `8px` | Label-to-input gap, compact inline gaps |
| `md` | `3` | `12px` | Related action stack gaps, compact padding |
| `base` | `4` | `16px` | Internal surface/input padding, standard vertical rhythm |
| `lg` | `6` | `24px` | Screen horizontal padding (`px-6`), card padding (`p-6`), intra-section spacing |
| `xl` | `8` | `32px` | Header-to-content separation, major block spacing |
| `2xl` | `10` | `40px` | Unrelated section separation (`gap-10`), vertical screen breathing room |
| `3xl` | `12` | `48px` | Minimum interactive touch-target height (`min-h-12`), large editorial gaps |

---

## 4. Corner Radius Scale

Restricted in `tailwind.config.js`:

| Token (`RADIUS`) | Class | Value | Intended Use |
|---|---|---:|---|
| `sm` | `rounded-sm` | `12px` | Inputs, status banners, read-only fields, compact surfaces |
| `md` | `rounded-md` | `16px` | Buttons, cards, dialogs, editorial highlight boxes |
| `lg` | `rounded-lg` | `24px` | Bottom sheets, large feature containers |
| `full` | `rounded-full` | `9999px` | Pills, chips, circular icon buttons, avatars |
| `none` | `rounded-none` | `0px` | Full-bleed edge-to-edge elements only |

---

## 5. Structural Border & Shadow Prohibition

`tailwind.config.js` restricts `borderWidth`, `boxShadow`, `ringWidth`, and `outlineWidth` to `0` / `none`. Never bypass this with inline styles (`borderWidth`, `shadowColor`, `elevation`).
