import Image from '@/components/ui/image';
import { LongArrowRight } from '@/components/icons/long-arrow-right';
import { LongArrowUp } from '@/components/icons/long-arrow-up';
import { VerifiedIcon } from '@/components/icons/verified-icon';
import { GasIcon } from '@/components/icons/gas-icon';
import { QuestionIcon } from '@/components/icons/question-icon';
import { StaticImageData } from 'next/image';

type CardProps = {
  name: string;
  avatar: StaticImageData | string;
  date: string;
  time: string;
  transactionType: string;
  transactionFrom: string;
  transactionFromAvatar: StaticImageData | string;
  transactionMethodLogo: StaticImageData | string;
  transactionMethod: string;
  transactionAmount: number;
  gasFee: number;
  currencyType: string;
};

export default function TransactionHistoryCard({ item }: { item: CardProps }) {
  const {
    name,
    avatar,
    date,
    time,
    currencyType,
    gasFee,
    transactionMethod,
    transactionMethodLogo,
    transactionFromAvatar,
    transactionFrom,
    transactionAmount,
    transactionType,
  } = item ?? {};
  const bgColor = transactionType === 'credited' ? '#D2D786' : '#F2C672';
  return (
    <div className="rounded-lg bg-white p-4 text-sm shadow-card dark:bg-light-dark sm:p-5 md:p-6">
      <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-3.5 dark:border-gray-700 sm:pb-5">
        <div className="flex items-center font-medium ">
          <Image
            src={avatar}
            alt="wallet"
            width={24}
            height={24}
            className="rounded-full"
          />
          <div className="truncate -tracking-wider text-gray-900 ltr:ml-2 rtl:mr-2 dark:text-white">
            {name}
          </div>
        </div>
        <div className="truncate text-xs -tracking-wide text-gray-600 ltr:pl-2 rtl:pr-2 dark:text-gray-400 xs:text-sm ">
          {date}
        </div>
      </div>
      <div className="grid grid-cols-9 gap-x-3 pt-4 md:gap-x-5 md:pt-6">
        <div className="col-span-4 flex flex-col gap-2.5 sm:flex-row sm:gap-x-4 md:flex-col 2xl:flex-row">
          <div className="flex items-center lg:w-1/2">
            <div
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white md:h-9 md:w-9 xl:h-10 xl:w-10"
              style={{ backgroundColor: bgColor }}
            >
              <LongArrowUp
                className={`h-5 w-5 xl:h-6 xl:w-6 ${
                  transactionType === 'credited' ? 'rotate-180' : 'rotate-0'
                }`}
              />
              <div className="absolute top-0 ltr:-right-1.5 rtl:-left-1.5">
                <VerifiedIcon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex flex-col truncate ltr:ml-2.5 rtl:mr-2.5 xl:ltr:ml-4 xl:rtl:mr-4">
              <strong className="mb-0.5 font-medium -tracking-wider text-gray-900 dark:text-white">
                {transactionType === 'credited' ? 'Receive' : 'Send'}
              </strong>
              <span className="text-xs text-gray-400">{time}</span>
            </div>
          </div>
          <div className="flex items-center lg:w-1/2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-600 dark:text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
              {transactionFromAvatar ? (
                <Image
                  src={transactionFromAvatar}
                  alt={transactionFrom}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <QuestionIcon className="h-5 w-5 lg:h-6 lg:w-6" />
              )}
            </div>
            <div className="flex flex-col truncate ltr:ml-2.5 rtl:mr-2.5 xl:ltr:ml-4 xl:rtl:mr-4">
              <span className="mb-0.5 text-xs text-gray-400">From</span>
              <strong className="truncate font-medium -tracking-wider text-gray-900 dark:text-white">
                {transactionFrom}
              </strong>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center text-gray-600 dark:text-gray-400 ltr:sm:pl-3 rtl:sm:pr-3 ltr:md:pl-0 rtl:md:pr-0 ltr:lg:pl-3 rtl:lg:pr-3">
          <LongArrowRight className="h-5 w-5 rtl:rotate-180 md:h-6 md:w-6 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
        </div>
        <div className="col-span-4  flex flex-col gap-2.5 sm:flex-row sm:gap-x-4 md:flex-col 2xl:flex-row">
          <div className="flex items-center lg:w-1/2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-600 dark:text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
              {transactionMethodLogo ? (
                <Image
                  src={transactionMethodLogo}
                  alt={transactionMethod}
                  width={40}
                  height={40}
                  className="rounded-full"
                  placeholder="blur"
                />
              ) : (
                <QuestionIcon className="h-5 w-5 xl:h-6 xl:w-6" />
              )}
            </div>
            <div className="flex flex-col truncate ltr:ml-2.5 rtl:mr-2.5 xl:ltr:ml-4 xl:rtl:mr-4">
              <span className="mb-0.5 text-xs text-gray-400">
                +{transactionAmount}
              </span>
              <strong className="font-medium -tracking-wider text-gray-900 dark:text-white">
                {transactionMethod}
              </strong>
            </div>
          </div>
          <div className="flex items-center lg:w-1/2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600/5 text-gray-600 dark:text-gray-400 md:h-9 md:w-9 xl:h-10 xl:w-10">
              <GasIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col truncate ltr:ml-2.5 rtl:mr-2.5 xl:ltr:ml-4 xl:rtl:mr-4">
              <span className="mb-0.5 text-xs text-gray-400">Gas Fee</span>
              <strong className="font-medium -tracking-wider text-gray-900 dark:text-white">
                {gasFee}
                {currencyType}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
