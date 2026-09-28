import './index.css';

export {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from './components/Button/Button';

export { Checkbox, type CheckboxProps } from './components/Checkbox/Checkbox';

export {
  CheckboxGroup,
  type CheckboxGroupProps,
} from './components/CheckboxGroup/CheckboxGroup';

export { Field, type FieldProps } from './components/Field/Field';

export {
  FieldContext,
  useFieldContext,
  type FieldContextValue,
} from './components/Field/FieldContext';

export { Form, type FormProps } from './components/Form/Form';

export { Input, type InputProps } from './components/Input/Input';

export { Radio, type RadioProps } from './components/Radio/Radio';

export { Select, type SelectProps } from './components/Select/Select';

export { Switch, type SwitchProps } from './components/Switch/Switch';

export { Textarea, type TextareaProps } from './components/Textarea/Textarea';

export {
  Badge,
  type BadgeProps,
  type BadgeVariant,
} from './components/Badge/Badge';

export { Chips, type ChipsProps } from './components/Chips/Chips';

export {
  Label,
  type LabelProps,
  type LabelVariant,
  type LabelSize,
} from './components/Label/Label';

export {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  type TabsProps,
  type TabListProps,
  type TabProps,
  type TabPanelProps,
} from './components/Tabs/Tabs';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from './components/Accordion/Accordion';

export {
  Tooltip,
  type TooltipProps,
  type TooltipPlacement,
  type TooltipArrowAlignment,
} from './components/Tooltip/Tooltip';

export {
  Banner,
  type BannerProps,
  type BannerVariant,
  type BannerLayout,
} from './components/Banner/Banner';

export {
  BottomSheet,
  type BottomSheetProps,
  type BottomSheetIconAction,
} from './components/BottomSheet/BottomSheet';

export {
  NavigationBottom,
  type NavigationBottomProps,
  type NavItemProps,
} from './components/NavigationBottom/NavigationBottom';

export {
  Countdown,
  type CountdownProps,
  type CountdownVariant,
  type CountdownDisplay,
} from './components/Countdown/Countdown';

export {
  BannerGradient,
  type BannerGradientVariant,
  type BannerGradientGradient,
  type BannerGradientPageControl,
  type BannerGradientProps,
} from './components/BannerGradient/BannerGradient';

export {
  BannerInfo,
  type BannerInfoProps,
} from './components/BannerInfo/BannerInfo';

export {
  Coachmark,
  type CoachmarkProps,
  type CoachmarkPlacement,
} from './components/Coachmark/Coachmark';

export { useFormField } from './hooks/useFormField';

export type { FormFieldProps } from './types/form';

// ── Icons ─────────────────────────────────────────────────────────────────────
export {
  IconBase,
  type IconBaseProps,
  type IconSize,
  type IconColor,
} from './components/Icon/IconBase';

export {
  IconButton,
  type IconButtonProps,
  type IconButtonVariant,
  type IconButtonSize,
} from './components/IconButton/IconButton';

export {
  Snackbar,
  type SnackbarProps,
  type SnackbarVariant,
  type SnackbarPlacement,
} from './components/Snackbar/Snackbar';

export {
  Dialog,
  type DialogProps,
  type DialogSize,
} from './components/Dialog/Dialog';

// ── Theme (MUI integration) ──────────────────────────────────────────────────
export {
  FqThemeProvider,
  type FqThemeProviderProps,
} from './theme/FqThemeProvider';
export { fqTheme, type FqTheme } from './theme/fqTheme';
