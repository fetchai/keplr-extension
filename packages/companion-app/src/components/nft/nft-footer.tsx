import { useModal } from '@/components/modal-views/context';
import AnchorLink from '@/components/ui/links/anchor-link';
import cn from 'classnames';
import Image from '@/components/ui/image';
import AuctionCountdown from '@/components/nft/auction-countdown';
import Button from '@/components/ui/button';
import Avatar1 from '@/assets/images/avatar/3.png';

interface NftFooterProps {
  className?: string;
  currentBid: any;
  auctionTime: Date | string | number;
  isAuction?: boolean;
  price?: number;
}

export default function NftFooter({
  className = 'md:hidden',
  currentBid,
  auctionTime,
  isAuction,
  price,
}: NftFooterProps) {
  const { openModal } = useModal();
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 bg-body dark:bg-dark md:-mx-2',
        className
      )}
    >
      <div className="-mx-4 border-t-2 border-gray-900 px-4 pt-4 pb-5 dark:border-gray-700 sm:-mx-6 sm:px-6 md:mx-2 md:px-0 md:pt-5 lg:pt-6 lg:pb-7">
        {isAuction && (
          <div className="flex gap-4 pb-3.5 md:pb-4 xl:gap-5">
            <div className="block w-1/2 shrink-0 md:w-2/5">
              <h3 className="mb-1 truncate text-13px font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-1.5 sm:text-sm">
                Current bid <span className="md:hidden">by</span>{' '}
                <AnchorLink
                  href={currentBid?.authorSlug ?? '#'}
                  className="normal-case text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden"
                >
                  @{currentBid?.name}
                </AnchorLink>
              </h3>
              <div className="text-lg font-medium -tracking-wider md:text-xl xl:text-2xl">
                {currentBid?.amount} ETH
              </div>
              <AnchorLink
                href={currentBid?.authorSlug ?? '#'}
                className="mt-2 hidden items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:inline-flex"
              >
                <div className="h-6 w-6 rounded-full ltr:mr-2 rtl:ml-2">
                  <Image src={Avatar1} alt="avatar" width={24} height={24} />
                </div>
                @{currentBid?.name}
              </AnchorLink>
            </div>
            <div className="block w-1/2 shrink-0 md:w-3/5">
              <h3 className="mb-1 truncate text-13px font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-1.5 sm:text-sm">
                Auction ends in
              </h3>
              <AuctionCountdown date={auctionTime} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button shape="rounded">
            {isAuction ? 'PLACE A BID' : `BUY FOR ${price} ETH`}
          </Button>
          <Button
            shape="rounded"
            variant="solid"
            color="gray"
            className="dark:bg-gray-800"
            onClick={() => openModal('SHARE_VIEW')}
          >
            SHARE
          </Button>
        </div>
      </div>
    </div>
  );
}
