import type { CoinTypes } from '@/types';
import { Fragment } from 'react';
import cn from 'classnames';
import { Listbox } from '@/components/ui/listbox';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Transition } from '@/components/ui/transition';

type CoinListBoxProps = {
  coins: CoinTypes[];
  className?: string;
  selectedCoin: CoinTypes;
  setSelectedCoin: (selectedCoin: CoinTypes) => void;
};

export default function CoinListBox({
  className,
  coins,
  selectedCoin,
  setSelectedCoin,
}: CoinListBoxProps) {
  return (
    <div className={cn(className)}>
      <Listbox value={selectedCoin} onChange={setSelectedCoin}>
        <Listbox.Button className="flex h-11 w-full items-center justify-between whitespace-nowrap border-gray-100 px-4 pl-3 text-sm text-gray-900 ltr:rounded-tl-lg ltr:rounded-bl-lg ltr:border-r rtl:border-l dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-13 sm:pl-4">
          <div className="flex items-center gap-3 font-medium ltr:mr-2 rtl:ml-2">
            <span className="sm:[&>*]:h-[30px] sm:[&>*]:w-[30px]">
              {selectedCoin.icon}
            </span>
            {selectedCoin.code}
          </div>
          <ChevronDown />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute -left-[1px] -right-[1px] z-50 mt-2 origin-top-right rounded-lg bg-white p-3 shadow-large dark:bg-gray-800">
            {coins?.map((coin) => (
              <Listbox.Option key={coin.code} value={coin}>
                {({ selected }) => (
                  <span
                    className={`my-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition dark:text-white  ${
                      selected
                        ? 'my-1 bg-gray-100 dark:bg-dark'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {coin.icon}
                    {coin.name}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}
