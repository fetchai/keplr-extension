import cn from 'classnames';
import { Switch } from '@/components/ui/switch';

interface ToggleBarProps {
  title: string;
  subTitle?: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}

function ToggleBar({
  title,
  subTitle,
  icon,
  checked,
  onChange,
  children,
}: React.PropsWithChildren<ToggleBarProps>) {
  return (
    <div className="rounded-lg bg-white shadow-card dark:bg-light-dark">
      <div className="relative flex items-center justify-between gap-4 p-4">
        <div className="flex items-center ltr:mr-6 rtl:ml-6">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900 ltr:mr-2 rtl:ml-2 dark:bg-gray-600 dark:text-gray-400">
              {icon}
            </div>
          )}
          <div>
            <span className="block text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-sm">
              {title}
            </span>
            {subTitle && (
              <span className="mt-1 hidden text-xs tracking-tighter text-gray-600 dark:text-gray-400 sm:block">
                {subTitle}
              </span>
            )}
          </div>
        </div>

        <Switch checked={checked} onChange={onChange}>
          <div
            className={cn(
              checked
                ? 'bg-brand dark:bg-white'
                : 'bg-gray-200 dark:bg-gray-700',
              'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
            )}
          >
            <span
              className={cn(
                checked
                  ? 'bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-gray-700'
                  : 'bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-gray-400',
                'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
              )}
            />
          </div>
        </Switch>
      </div>

      {children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default ToggleBar;
