import cn from 'classnames';
import dayjs from 'dayjs';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { ArrowLinkIcon } from '@/components/icons/arrow-link-icon';
import { StaticImageData } from 'next/image';
type ItemType = {
  id?: string | number;
  label: string;
  name: string;
  authorSlug: string;
  avatar?: StaticImageData;
  created_at: Date | string;
  amount?: number | null;
  transactionUrl?: String;
};
type FeaturedCardProps = {
  item: ItemType;
  className?: string;
};

export default function FeaturedCard({ item, className }: FeaturedCardProps) {
  const {
    label,
    name,
    avatar,
    authorSlug,
    created_at,
    amount,
    transactionUrl,
  } = item;
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg bg-white p-3 text-sm font-medium shadow-card dark:bg-light-dark',
        className
      )}
    >
      <div className="flex w-[68%] shrink-0 items-center">
        <div className="h-7 w-7 shrink-0 rounded-full md:h-8 md:w-8 xl:h-10 xl:w-10">
          {avatar && <Image src={avatar} alt={name} width={40} height={40} />}
        </div>
        <div className="truncate ltr:ml-2 rtl:mr-2">
          <div className="mb-0.5 truncate text-sm font-medium -tracking-wider text-gray-900 dark:text-white">
            {label} by{' '}
            <AnchorLink
              href={authorSlug}
              className="-tracking-wide text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              @{name}
            </AnchorLink>
          </div>
          <div className="truncate text-xs -tracking-wider text-gray-600 dark:text-gray-400">
            {dayjs(created_at).format('MMM D, YYYY')} at{' '}
            {dayjs(created_at).format('h:mm a')}
          </div>
        </div>
      </div>
      {(amount || transactionUrl) && (
        <div className="flex shrink-0 items-center ltr:pl-2 ltr:pr-0.5 rtl:pr-2 rtl:pl-0.5">
          {amount && (
            <div className="text-sm font-medium -tracking-wider ltr:pr-2.5 rtl:pl-2.5 sm:text-base sm:ltr:pr-3 sm:rtl:pl-3">
              {amount} ETH
            </div>
          )}
          {transactionUrl && (
            <AnchorLink
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLinkIcon className="h-3 w-3" />
            </AnchorLink>
          )}
        </div>
      )}
    </div>
  );
}
