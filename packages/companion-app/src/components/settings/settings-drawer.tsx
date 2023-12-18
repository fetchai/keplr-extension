import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import cn from 'classnames';
import { Dialog } from '@/components/ui/dialog';
import { Transition } from '@/components/ui/transition';
import Button from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import Scrollbar from '@/components/ui/scrollbar';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { useDirection } from '@/lib/hooks/use-direction';
import { useThemeColor } from '@/lib/hooks/use-theme-color';
import { useSettingsDrawer } from '@/components/settings/settings-context';
import { Close } from '@/components/icons/close';
import { Sun } from '@/components/icons/sun';
import { Moon } from '@/components/icons/moon';
import { LeftAlign } from '@/components/icons/left-align';
import { RightAlign } from '@/components/icons/right-align';
import { ModernLayoutIcon } from '@/components/icons/modern-layout-icon';
import { RetroLayoutIcon } from '@/components/icons/retro-layout-icon';
import { MinimalLayoutIcon } from '@/components/icons/minimal-layout-icon';
import { ClassicLayoutIcon } from '@/components/icons/classic-layout-icon';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';

const ColorPreset = [
  {
    label: 'Black',
    value: '#323743',
  },
  {
    label: 'Blue',
    value: '#2a52be',
  },
  {
    label: 'Green',
    value: '#009e60',
  },
  {
    label: 'Red',
    value: '#e34234',
  },
  {
    label: 'Purple',
    value: '#9370DB',
  },
  {
    label: 'Orange',
    value: '#ffa500',
  },
];

// Component: SwitcherButton
interface SwitcherButtonProps {
  checked: boolean;
  title: string;
}
function SwitcherButton({
  checked,
  title,
  children,
}: React.PropsWithChildren<SwitcherButtonProps>) {
  return (
    <div className="group cursor-pointer">
      <span
        className={cn(
          'flex h-[70px] items-center justify-center rounded-lg text-center text-sm font-medium uppercase tracking-wide transition-all',
          checked
            ? 'bg-white shadow-large dark:bg-gray-600'
            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700'
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          'mt-3 block text-center text-sm transition-all',
          checked
            ? 'text-brand dark:text-white'
            : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
        )}
      >
        {title}
      </span>
    </div>
  );
}

// Component: ThemeSwitcher
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="px-6 pt-8">
      <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
        Mode
      </h4>
      <RadioGroup
        value={theme}
        onChange={setTheme}
        className="grid grid-cols-2 gap-5 "
      >
        <RadioGroup.Option value="light">
          {({ checked }) => (
            <SwitcherButton title={'Light'} checked={checked}>
              <Sun />
            </SwitcherButton>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="dark">
          {({ checked }) => (
            <SwitcherButton title={'Dark'} checked={checked}>
              <Moon />
            </SwitcherButton>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </div>
  );
}

// Component: DirectionSwitcher
function DirectionSwitcher() {
  const [direction, setDirection] = useLocalStorage('criptic-direction', 'ltr');
  useDirection(direction ? direction : 'ltr');
  return (
    <div className="px-6 pt-8">
      <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
        Direction
      </h4>
      <RadioGroup
        value={direction}
        onChange={setDirection}
        className="grid grid-cols-2 gap-5 "
      >
        <RadioGroup.Option value="ltr">
          {({ checked }) => (
            <SwitcherButton title={'LTR'} checked={checked}>
              <LeftAlign />
            </SwitcherButton>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="rtl">
          {({ checked }) => (
            <SwitcherButton title={'RTL'} checked={checked}>
              <RightAlign />
            </SwitcherButton>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </div>
  );
}

// Component: LayoutSwitcher
const LayoutIcons = {
  [LAYOUT_OPTIONS.MODERN]: <ModernLayoutIcon />,
  [LAYOUT_OPTIONS.MINIMAL]: <MinimalLayoutIcon />,
  [LAYOUT_OPTIONS.RETRO]: <RetroLayoutIcon />,
  [LAYOUT_OPTIONS.CLASSIC]: <ClassicLayoutIcon />,
};

function LayoutSwitcher() {
  const router = useRouter();
  const {
    pathname,
    query: { view },
  } = router;
  const { layout, setLayout } = useLayout();
  const layoutOptions = Object.values(LAYOUT_OPTIONS);
  function handleLayoutChange(value: string) {
    setLayout(value);
    router.push(
      {
        pathname,
        ...(value !== LAYOUT_OPTIONS.MODERN && {
          query: {
            layout: value,
          },
        }),
        ...(view !== undefined && {
          query: {
            view,
          },
        }),
        ...(value !== LAYOUT_OPTIONS.MODERN &&
          view !== undefined && {
            query: {
              layout: value,
              view,
            },
          }),
      },
      undefined,
      { scroll: false }
    );
  }
  return (
    <div className="px-6 pt-8">
      <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
        Layout
      </h4>
      <RadioGroup
        value={layout ?? LAYOUT_OPTIONS.MODERN}
        onChange={(value) => handleLayoutChange(value)}
        className="grid grid-cols-2 gap-5 "
      >
        {layoutOptions.map((option) => (
          <RadioGroup.Option key={option} value={option}>
            {({ checked }) => (
              <SwitcherButton title={option} checked={checked}>
                {LayoutIcons[option]}
              </SwitcherButton>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}

// Component: ColorSwitcher
function ColorSwitcher() {
  const [themeColor, setThemeColor] = useLocalStorage(
    'criptic-color',
    '#323743'
  );
  useThemeColor(themeColor ? themeColor : '#323743');
  return (
    <div className="px-6 pt-8">
      <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
        Color
      </h4>
      <RadioGroup
        value={themeColor}
        onChange={setThemeColor}
        className="grid grid-cols-3 gap-5 "
      >
        {ColorPreset.map((item, index) => (
          <RadioGroup.Option value={item.value} key={index}>
            {({ checked }) => (
              <SwitcherButton title={item.label} checked={checked}>
                <span
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: item.value }}
                />
              </SwitcherButton>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function SettingsDrawer() {
  const { isSettingsOpen, closeSettings } = useSettingsDrawer();
  return (
    <Transition appear show={isSettingsOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 overflow-hidden"
        onClose={closeSettings}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-0" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-out duration-300"
          enterFrom="ltr:translate-x-full rtl:-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in duration-300"
          leaveFrom="translate-x-0"
          leaveTo="ltr:translate-x-full rtl:-translate-x-full"
        >
          <div className="fixed inset-y-0 w-80 max-w-full bg-white/95 shadow-[0_0_80px_rgba(17,24,39,0.2)] backdrop-blur ltr:right-0 rtl:left-0 dark:bg-dark/90">
            <div className="h-full w-full">
              <div className="flex h-16 items-center justify-between gap-6 border-b border-dashed border-gray-200 px-6 dark:border-gray-700">
                <h3 className="text-base font-medium uppercase text-gray-900 dark:text-white">
                  Settings
                </h3>
                <Button
                  title="Close"
                  color="white"
                  shape="circle"
                  variant="transparent"
                  size="small"
                  onClick={closeSettings}
                >
                  <Close className="h-auto w-2.5" />
                </Button>
              </div>

              <Scrollbar style={{ height: 'calc(100% - 64px)' }}>
                <div className="pb-8">
                  <ThemeSwitcher />
                  <LayoutSwitcher />
                  <DirectionSwitcher />
                  <ColorSwitcher />
                </div>
              </Scrollbar>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
