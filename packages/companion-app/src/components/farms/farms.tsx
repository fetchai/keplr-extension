import Button from '@/components/ui/button';
import FarmList from '@/components/farms/list';
import ActiveLink from '@/components/ui/links/active-link';
import { FarmsData } from '@/data/static/farms-data';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import cn from 'classnames';
import { Transition } from '@/components/ui/transition';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import { Switch } from '@/components/ui/switch';
import { ChevronDown } from '@/components/icons/chevron-down';
import { SearchIcon } from '@/components/icons/search';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import HorizontalThreeDots from '@/components/icons/horizontal-three-dots';
import routes from '@/config/routes';

const sort = [
  { id: 1, name: 'Hot' },
  { id: 2, name: 'APR' },
  { id: 3, name: 'Earned' },
  { id: 4, name: 'Total staked' },
  { id: 5, name: 'Latest' },
];

function SortList() {
  const { layout } = useLayout();
  const [selectedItem, setSelectedItem] = useState(sort[0]);
  return (
    <div className="relative w-full lg:w-auto">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        {layout === LAYOUT_OPTIONS.RETRO ? (
          <>
            <Listbox.Button className="hidden h-11 w-full items-center justify-between rounded-lg pr-2 text-sm text-gray-900 dark:text-white lg:flex xl:flex 3xl:hidden">
              <HorizontalThreeDots />
            </Listbox.Button>
            <Listbox.Button className="flex h-11 w-full items-center justify-between rounded-lg bg-gray-100 px-4 text-sm text-gray-900 dark:bg-light-dark dark:text-white lg:hidden lg:w-40 xl:hidden xl:w-48 3xl:flex">
              {selectedItem.name} <ChevronDown />
            </Listbox.Button>
          </>
        ) : (
          <Listbox.Button className="flex h-11 w-full items-center justify-between rounded-lg bg-gray-100 px-4 text-sm text-gray-900 dark:bg-light-dark dark:text-white md:w-36 lg:w-40 xl:w-48">
            {selectedItem.name}
            <ChevronDown />
          </Listbox.Button>
        )}
        <Transition
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-20 mt-2 w-full min-w-[150px] origin-top-right rounded-lg bg-white p-3 px-1.5 shadow-large shadow-gray-400/10 dark:bg-[rgba(0,0,0,0.5)] dark:shadow-gray-900 dark:backdrop-blur">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition dark:text-white  ${
                      selected
                        ? 'my-1 bg-gray-100 dark:bg-gray-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

function Search() {
  return (
    <form
      className="relative flex w-full rounded-full lg:w-auto lg:basis-72 xl:w-48"
      noValidate
      role="search"
    >
      <label className="flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
          placeholder="Search farms"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
    </form>
  );
}

function StackedSwitch() {
  const [isStacked, setIsStacked] = useState(false);
  return (
    <Switch
      checked={isStacked}
      onChange={setIsStacked}
      className="flex items-center gap-2 text-gray-400 sm:gap-3"
    >
      <div
        className={cn(
          isStacked ? 'bg-brand dark:bg-white' : 'bg-gray-200 dark:bg-gray-500',
          'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
        )}
      >
        <span
          className={cn(
            isStacked
              ? 'bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-light-dark'
              : 'bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-light-dark',
            'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
          )}
        />
      </div>
      <span className="inline-flex text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-sm">
        Stacked only
      </span>
    </Switch>
  );
}

function Status() {
  const [status, setStatus] = useState('live');
  return (
    <RadioGroup
      value={status}
      onChange={setStatus}
      className="flex items-center sm:gap-3"
    >
      <RadioGroup.Option value="live">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${
              checked ? 'text-white' : 'text-brand dark:text-white/50'
            }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">LIVE</span>
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="finished">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${
              checked ? 'text-white' : 'text-brand dark:text-white/50'
            }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">FINISHED</span>
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}

export default function Farms() {
  const { layout } = useLayout();
  return (
    <div className="mx-auto w-full">
      <div
        className={cn(
          'mb-6 flex flex-col justify-between gap-4',
          layout === LAYOUT_OPTIONS.RETRO
            ? 'lg:flex-row lg:items-center lg:gap-6'
            : 'md:flex-row md:items-center md:gap-6'
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Status />
          <div
            className={cn(
              layout === LAYOUT_OPTIONS.RETRO ? 'lg:hidden' : 'md:hidden'
            )}
          >
            <StackedSwitch />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div
            className={cn(
              'hidden shrink-0 ',
              layout === LAYOUT_OPTIONS.RETRO ? 'lg:block' : 'md:block'
            )}
          >
            <StackedSwitch />
          </div>
          <Search />
          <SortList />
        </div>
      </div>

      <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-5">
        <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
          Pool
        </span>
        <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
          Earned
        </span>
        <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
          APR
        </span>
        <span className="hidden px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
          Liquidity
        </span>
        <span className="hidden px-4 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
          Multiplier
        </span>
      </div>

      {FarmsData.map((farm) => (
        <FarmList
          key={farm.id}
          from={farm.from}
          to={farm.to}
          earned={farm.earned}
          apr={farm.apr}
          liquidity={farm.liquidity}
          multiplier={farm.multiplier}
        >
          <div className="mb-4 grid grid-cols-2 gap-4 sm:mb-6 sm:gap-6">
            <input
              type="number"
              placeholder="0.0"
              className="spin-button-hidden h-11 appearance-none rounded-lg border-solid border-gray-200 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 sm:h-13"
            />
            <input
              type="number"
              placeholder="0.0"
              className="spin-button-hidden h-11 appearance-none rounded-lg border-solid border-gray-200 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 sm:h-13"
            />
          </div>
          <ActiveLink href={routes.farms}>
            <Button shape="rounded" fullWidth size="large">
              APPROVE
            </Button>
          </ActiveLink>
        </FarmList>
      ))}
    </div>
  );
}
