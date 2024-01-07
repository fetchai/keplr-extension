import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Tab, TabItem, TabPanels, TabPanel } from '@/components/ui/tab';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useClickAway } from '@/lib/hooks/use-click-away';

interface TabMenuItem {
  title: React.ReactNode;
  path: string;
}

interface ParamTabTypes {
  tabMenu: TabMenuItem[];
  children: React.ReactChild[];
}

export { TabPanel };

export default function ParamTab({ tabMenu, children }: ParamTabTypes) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const dropdownEl = useRef<HTMLDivElement>(null);
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [visibleMobileMenu, setVisibleMobileMenu] = useState(false);

  const {
    query: { ...restQuery },
  } = router;
  function handleTabChange(index: number) {
    router.push(
      {
        pathname: router.pathname,
        query: { ...restQuery, view: tabMenu[index].path },
      },
      undefined,
      { scroll: false }
    );
  }
  useEffect(() => {
    if (router?.query?.view) {
      setSelectedTabIndex(
        tabMenu.findIndex((item) => router.query.view === item.path)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useClickAway(dropdownEl, () => {
    setVisibleMobileMenu(false);
  });
  return (
    <Tab.Group
      selectedIndex={selectedTabIndex}
      onChange={(index) => handleTabChange(index)}
    >
      <Tab.List className="relative mb-6 bg-body text-sm uppercase before:absolute before:left-0 before:bottom-0 before:w-full before:rounded-sm before:bg-gray-200 dark:bg-dark dark:before:bg-gray-800 sm:gap-8 sm:rounded-none md:before:h-0.5">
        {isMounted && ['xs', 'sm'].indexOf(breakpoint) !== -1 ? (
          <div
            ref={dropdownEl}
            className="rounded-lg border-2 border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => setVisibleMobileMenu(!visibleMobileMenu)}
              className="flex w-full items-center justify-between py-2.5 px-4 uppercase text-gray-400 dark:text-gray-300 sm:px-5 sm:py-3.5"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {tabMenu[selectedTabIndex].title}
              </span>
              <ChevronDown className="h-auto w-3.5" />
            </button>
            <div
              className={cn(
                'absolute top-full left-0 z-10 mt-1 grid w-full gap-0.5 rounded-lg border border-gray-200 bg-white p-2 text-left shadow-large dark:border-gray-700 dark:bg-gray-800 xs:gap-1',
                visibleMobileMenu
                  ? 'visible opacity-100'
                  : 'invisible opacity-0'
              )}
            >
              {tabMenu.map((item) => (
                <div
                  key={item.path}
                  onClick={() => setVisibleMobileMenu(false)}
                  className="w-full"
                >
                  <TabItem className="w-full">{item.title}</TabItem>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-6 md:gap-8 xl:gap-10 3xl:gap-12">
            {tabMenu.map((item) => (
              <TabItem key={item.path}>{item.title}</TabItem>
            ))}
          </div>
        )}
      </Tab.List>
      <TabPanels>{children}</TabPanels>
    </Tab.Group>
  );
}
