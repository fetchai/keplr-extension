import { Fragment } from 'react';
import { Menu } from '@/components/ui/menu';
import { Transition } from '@/components/ui/transition';
import AnchorLink from '@/components/ui/links/anchor-link';
import { DotsIcon } from '@/components/icons/dots-icon';

export default function NftDropDown() {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="flex h-5 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
          <DotsIcon className="h-[3px] w-4" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <Menu.Items className="absolute z-20 mt-5 w-60 origin-top-right rounded-lg bg-white py-3 shadow-large ltr:right-0 rtl:left-0 dark:bg-gray-800">
            <div className="px-3">
              <Menu.Item>
                <AnchorLink
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"
                >
                  Place floor bid
                  <span className="inline-flex rounded-md bg-[#FF445C] px-2 py-1 text-xs text-white ltr:ml-2 rtl:mr-2">
                    new
                  </span>
                </AnchorLink>
              </Menu.Item>
              <Menu.Item>
                <AnchorLink
                  href="/profile"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"
                >
                  New bid
                </AnchorLink>
              </Menu.Item>
            </div>
            <div className="my-2.5 h-[1px] w-full border-t border-dashed border-gray-200 dark:border-gray-700"></div>
            <div className="px-3">
              <Menu.Item>
                <AnchorLink
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"
                >
                  Refresh metadata
                </AnchorLink>
              </Menu.Item>
              <Menu.Item>
                <AnchorLink
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"
                >
                  Open original ipfs
                </AnchorLink>
              </Menu.Item>
              <Menu.Item>
                <AnchorLink
                  href="/"
                  className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"
                >
                  Report
                </AnchorLink>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
