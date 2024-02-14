import { Tab } from '@headlessui/react';
import { motion, LayoutGroup } from 'framer-motion';
import cn from 'classnames';

export { Tab };

//
// Tab Item framer motion variant
//
export function TabItem({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <Tab
      className={({ selected }) =>
        cn(
          'relative py-2 uppercase tracking-wider hover:text-gray-900 focus:outline-none dark:hover:text-gray-100 xs:py-2.5 sm:py-3',
          {
            'font-medium text-brand dark:text-gray-100': selected,
            'text-gray-600 dark:text-gray-400': !selected,
          },
          className
        )
      }
    >
      {({ selected }) => (
        <>
          <span className="flex w-full justify-between px-3 md:px-0">
            {children}
          </span>
          {selected && (
            <motion.span
              className="absolute left-0 right-0 bottom-0 -z-[1] h-0.5 w-full rounded-lg bg-brand dark:bg-gray-400 md:z-0"
              layoutId="activeTabIndicator"
            />
          )}
        </>
      )}
    </Tab>
  );
}

//
// Tab Panels framer motion variant
//
export function TabPanels({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <Tab.Panels className={className}>
      <LayoutGroup>
        <>{children}</>
      </LayoutGroup>
    </Tab.Panels>
  );
}

//
// Tab Panel framer motion variant
//
export function TabPanel({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <Tab.Panel className={className}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 32 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </Tab.Panel>
  );
}
