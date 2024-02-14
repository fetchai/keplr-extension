import cn from 'classnames';
import { Plus } from '@/components/icons/plus';
import { ChevronForward } from '@/components/icons/chevron-forward';

export default function TopupButton({
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <button
      className={cn(
        'flex h-10 w-full items-center whitespace-nowrap rounded-lg border-2 border-dashed border-gray-500 bg-gray-100 px-6 text-sm uppercase tracking-wider text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white lg:h-12 3xl:h-13',
        className
      )}
    >
      <span className="mr-3.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white lg:h-6 lg:w-6">
        <Plus className="h-auto w-2.5 lg:w-auto" />
      </span>
      <span className="mr-3.5 flex-grow text-justify text-xs lg:text-sm">
        Top Up Balance
      </span>
      <ChevronForward className="rtl:rotate-180" />
    </button>
  );
}
