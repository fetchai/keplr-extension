import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import Avatar from '@/components/ui/avatar';
import TopupButton from '@/components/ui/topup-button';
import TransactCoin from '@/components/ui/transact-coin';
import WalletCard from '@/components/ui/wallet-card-two';
//images
import AuthorImage from '@/assets/images/author.jpg';

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'top-0 z-20 h-full w-full max-w-full border-dashed border-slate-200 ltr:left-0 rtl:right-0 dark:border-gray-700 lg:fixed lg:w-80 ltr:lg:border-l rtl:lg:border-r xl:pt-20 3xl:w-[350px]',
        className
      )}
    >
      <div className="absolute top-0 right-0 z-20 h-[75px] w-full bg-sidebar-body dark:bg-dark md:block xl:hidden" />
      <Scrollbar style={{ height: 'calc(100% + 20px)' }}>
        <div className="relative z-20 pb-5">
          <div className="my-16 mx-5 flex h-full flex-col justify-between overflow-x-hidden rounded-lg bg-transparent sm:mx-6 sm:flex-row lg:mx-0 lg:flex-col lg:p-6 xl:my-0 2xl:p-8">
            <div className="w-full sm:w-[48%] lg:w-full">
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
              <TopupButton className="mb-8" />
              <div>
                <span className="-mx-6 block border-t border-dashed border-t-gray-200 dark:border-t-gray-700 3xl:-mx-8" />

                <TransactCoin className="mt-6 mb-8" />
              </div>
              <span className="-mx-6 block border-t border-dashed border-t-gray-200 dark:border-t-gray-700 3xl:-mx-8" />
            </div>
            <div className="mt-10 w-full sm:mt-0 sm:w-[48%] lg:mt-8 lg:w-full">
              <WalletCard />
            </div>
          </div>
        </div>
      </Scrollbar>
    </aside>
  );
}
