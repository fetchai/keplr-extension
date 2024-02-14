import cn from 'classnames';
import { NextSeo } from 'next-seo';
import CoinSlider from '@/components/ui/coin-card';
import OverviewChart from '@/components/ui/chats/overview-chart';
import LiquidityChart from '@/components/ui/chats/liquidity-chart';
import VolumeChart from '@/components/ui/chats/volume-chart';
import TopPools from '@/components/ui/top-pools';
import TransactionTable from '@/components/transaction/transaction-table';
import TopCurrencyTable from '@/components/top-currency/currency-table';
import { coinSlideData } from '@/data/static/coin-slide-data';
import Avatar from '@/components/ui/avatar';
import TopupButton from '@/components/ui/topup-button';

//images
import AuthorImage from '@/assets/images/author.jpg';

export default function ModernScreen() {
  return (
    <>
      <NextSeo
        title="Criptic"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="flex flex-wrap">
        <div className="mb-8 w-full sm:mb-0 sm:w-1/2 sm:ltr:pr-6 sm:rtl:pl-6 md:w-[calc(100%-256px)] lg:w-[calc(100%-288px)] 2xl:w-[calc(100%-320px)] 3xl:w-[calc(100%-358px)]">
          <CoinSlider coins={coinSlideData} />
        </div>
        <div className="w-full sm:w-1/2 md:w-64 lg:w-72 2xl:w-80 3xl:w-[358px]">
          <div className="flex h-full flex-col justify-center rounded-lg bg-white p-6 shadow-card dark:bg-light-dark xl:p-8">
            <Avatar
              image={AuthorImage}
              alt="Author"
              className="mx-auto mb-6"
              size="lg"
            />
            <h3 className="mb-2 text-center text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 3xl:mb-3">
              My Balance
            </h3>
            <div className="mb-7 text-center font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl 3xl:mb-8 3xl:text-[32px]">
              $10,86,000
            </div>
            <TopupButton />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:my-10 md:grid-cols-2">
        <LiquidityChart />
        <VolumeChart />
      </div>

      <div className="my-8 sm:my-10">
        <TopCurrencyTable />
      </div>

      <div className="flex flex-wrap">
        <div
          className={cn(
            'w-full lg:w-[calc(100%-288px)] ltr:lg:pr-6 rtl:lg:pl-6 2xl:w-[calc(100%-320px)] 3xl:w-[calc(100%-358px)]'
          )}
        >
          <TransactionTable />
        </div>
        <div
          className={cn(
            'order-first mb-8 grid w-full grid-cols-1 gap-6 sm:mb-10 sm:grid-cols-2 lg:order-1 lg:mb-0 lg:flex lg:w-72 lg:flex-col 2xl:w-80 3xl:w-[358px]'
          )}
        >
          <OverviewChart />
          <TopPools />
        </div>
      </div>
    </>
  );
}
