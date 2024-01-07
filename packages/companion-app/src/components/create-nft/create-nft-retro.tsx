import { useState } from 'react';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import { Transition } from '@/components/ui/transition';
import { Listbox } from '@/components/ui/listbox';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Uploader from '@/components/ui/forms/uploader';
import InputLabel from '@/components/ui/input-label';
import ToggleBar from '@/components/ui/toggle-bar';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Ethereum } from '@/components/icons/ethereum';
import { Flow } from '@/components/icons/flow';
import { Warning } from '@/components/icons/warning';
import { Unlocked } from '@/components/icons/unlocked';
import React from 'react';
import Preview from '@/components/create-nft/nft-preview';
import PriceType from '@/components/create-nft/price-types-props';

const BlockchainOptions = [
  {
    id: 1,
    name: 'Ethereum',
    value: 'ethereum',
    icon: <Ethereum />,
  },
  {
    id: 2,
    name: 'Flow',
    value: 'flow',
    icon: <Flow />,
  },
];

export default function CreateNFTRetro() {
  const [publish, setPublish] = useState(true);
  const [explicit, setExplicit] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [priceType, setPriceType] = useState('fixed');
  const [blockchain, setBlockChain] = useState(BlockchainOptions[0]);
  return (
    <>
      <NextSeo
        title="Create NFT"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <form>
        <div className="mx-auto w-full pt-8 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-2xl">
              Create New Item
            </h2>
            <Preview />
          </div>
          <div className="mb-8 mt-6 grid grid-cols-1 gap-12 sm:mt-10">
            <div className="relative">
              {/* File uploader */}
              <div className="mb-8">
                <InputLabel title="Upload file" important />
                <Uploader />
              </div>

              {/* NFT price type */}
              <div className="flex items-center justify-between gap-4">
                <InputLabel
                  title="Put on marketplace"
                  subTitle="Enter price to allow users instantly purchase your NFT"
                />
                <div className="shrink-0">
                  <Switch
                    checked={publish}
                    onChange={() => setPublish(!publish)}
                  >
                    <div
                      className={cn(
                        publish ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-700',
                        'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
                      )}
                    >
                      <span
                        className={cn(
                          publish
                            ? 'bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-light-dark'
                            : 'bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-light-dark',
                          'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
                        )}
                      />
                    </div>
                  </Switch>
                </div>
              </div>
              {publish && (
                <PriceType value={priceType} onChange={setPriceType} />
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <InputLabel title="Price" important />
            <Input
              min={0}
              type="number"
              placeholder="Enter your price"
              inputClassName="spin-button-hidden"
            />
          </div>

          {/* Name */}
          <div className="mb-8">
            <InputLabel title="Name" important />
            <Input type="text" placeholder="Item name" />
          </div>

          {/* External link */}
          <div className="mb-8">
            <InputLabel
              title="External link"
              subTitle="We will include a link to this URL on this item's detail page, so that users can click to learn more about it."
            />
            <Input type="text" placeholder="https://yoursite.io/item/123" />
          </div>

          {/* Description */}
          <div className="mb-8">
            <InputLabel
              title="Description"
              subTitle="The description will be included on the item's detail page underneath its image."
            />
            <Textarea placeholder="Provide a detailed description of your item" />
          </div>

          {/* Unlockable content */}
          <div className="mb-3">
            <ToggleBar
              title="Unlockable Content"
              subTitle="Include unlockable content that can only be revealed by the owner of the item."
              icon={<Unlocked />}
              checked={unlocked}
              onChange={() => setUnlocked(!unlocked)}
            >
              {unlocked && (
                <Textarea placeholder="Enter content (access key, code to redeem, link to a file, etc.)" />
              )}
            </ToggleBar>
          </div>

          {/* Explicit content */}
          <div className="mb-8">
            <ToggleBar
              title="Explicit &amp; Sensitive Content"
              subTitle="Set this item as explicit and sensitive content"
              icon={<Warning />}
              checked={explicit}
              onChange={() => setExplicit(!explicit)}
            />
          </div>

          {/* Supply */}
          <div className="mb-8">
            <InputLabel
              title="Supply"
              subTitle="The number of items that can be minted."
            />
            <Input type="number" placeholder="1" disabled />
          </div>

          {/* Blockchain */}
          <div className="mb-8">
            <InputLabel title="Blockchain" />
            <div className="relative">
              <Listbox value={blockchain} onChange={setBlockChain}>
                <Listbox.Button className="text-case-inherit letter-space-inherit flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition-shadow duration-200 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600 sm:h-12 sm:px-5">
                  <div className="flex items-center">
                    <span className="ltr:mr-2 rtl:ml-2">{blockchain.icon}</span>
                    {blockchain.name}
                  </div>
                  <ChevronDown />
                </Listbox.Button>
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-large outline-none dark:border-gray-700 dark:bg-gray-800 xs:p-2">
                    {BlockchainOptions.map((option) => (
                      <Listbox.Option key={option.id} value={option}>
                        {({ selected }) => (
                          <div
                            className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 transition dark:text-gray-100  ${
                              selected
                                ? 'bg-gray-200/70 font-medium dark:bg-gray-600/60'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                            }`}
                          >
                            <span className="ltr:mr-2 rtl:ml-2">
                              {option.icon}
                            </span>
                            {option.name}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>
          </div>

          <Button shape="rounded">CREATE</Button>
        </div>
      </form>
    </>
  );
}
