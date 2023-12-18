import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import ActiveLink from '@/components/ui/links/active-link';
import AnchorLink from '@/components/ui/links/anchor-link';
import { RangeIcon } from '@/components/icons/range-icon';
import { ExportIcon } from '@/components/icons/export-icon';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
// dynamic import
const Listbox = dynamic(() => import('@/components/ui/list-box'));

const tradeMenu = [
  {
    name: 'Swap',
    value: routes.swap,
  },
  {
    name: 'Liquidity',
    value: routes.liquidity,
  },
  {
    name: 'Vote',
    value: routes.vote,
  },
];

function ActiveNavLink({ href, title, isActive, className }: any) {
  const router = useRouter();
  const {
    query: { ...restQuery },
  } = router;
  return (
    <ActiveLink
      href={{ pathname: href, query: restQuery }}
      className={cn(
        'relative z-[1] inline-flex items-center py-1.5 px-3',
        className
      )}
      activeClassName="font-medium text-white"
    >
      <span>{title}</span>
      {isActive && (
        <motion.span
          className="absolute left-0 right-0 bottom-0 -z-[1] h-full w-full rounded-lg bg-brand shadow-large"
          layoutId="activeNavLinkIndicator"
        />
      )}
    </ActiveLink>
  );
}

export default function Trade({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const currentPath = tradeMenu.findIndex(
    (item) => item.value === router.pathname
  );
  let [selectedMenuItem, setSelectedMenuItem] = useState(tradeMenu[0]);
  function handleRouteOnSelect(path: string) {
    router.push(path);
  }
  useEffect(() => {
    setSelectedMenuItem(tradeMenu[currentPath]);
  }, [currentPath]);
  return (
    <div className="pt-8 text-sm xl:pt-10">
      <div className="mx-auto w-full max-w-lg rounded-lg bg-white p-5 pt-4 shadow-card dark:bg-light-dark xs:p-6 xs:pt-5">
        <nav className="mb-5 min-h-[40px] border-b border-dashed border-gray-200 pb-4 uppercase tracking-wider dark:border-gray-700 xs:mb-6 xs:pb-5 xs:tracking-wide">
          {isMounted && ['xs'].indexOf(breakpoint) !== -1 && (
            <Listbox
              options={tradeMenu}
              selectedOption={selectedMenuItem}
              onChange={setSelectedMenuItem}
              onSelect={(path) => handleRouteOnSelect(path)}
              className="w-full"
            >
              <AnchorLink
                href={routes.charts}
                className="inline-flex items-center justify-between gap-1.5 rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/70"
              >
                Charts
                <ExportIcon className="h-auto w-2.5" />
              </AnchorLink>
              <button className="inline-flex items-center justify-between gap-1.5 rounded-md px-3 py-2 uppercase text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/70">
                Settings
                <RangeIcon className="h-auto w-3" />
              </button>
            </Listbox>
          )}
          <div className="hidden items-center justify-between text-gray-600 dark:text-gray-400 sm:flex">
            {tradeMenu.map((item) => (
              <ActiveNavLink
                key={item.name}
                href={item.value}
                title={item.name}
                isActive={item.value === router.pathname}
              />
            ))}
            <AnchorLink
              href="/"
              className="inline-flex items-center gap-1.5 py-1.5 px-3"
            >
              Charts
              <ExportIcon className="h-auto w-2.5" />
            </AnchorLink>
            <Button
              variant="transparent"
              shape="circle"
              size="small"
              className="dark:text-white"
            >
              <RangeIcon />
            </Button>
          </div>
        </nav>
        <AnimatePresence mode={'wait'}>
          <motion.div
            initial="exit"
            animate="enter"
            exit="exit"
            variants={fadeInBottom('easeIn', 0.25)}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
