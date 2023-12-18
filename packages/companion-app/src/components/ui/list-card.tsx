import Image from '@/components/ui/image';
import cn from 'classnames';
import { StaticImageData } from 'next/image';
type ItemType = {
  id?: string | number;
  name: string;
  logo: StaticImageData;
  balance?: string;
  coinType?: string;
};
type CardProps = {
  item: ItemType;
  className?: string;
  variant?: 'small' | 'medium' | 'large';
};

const variants = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-8 h-8 sm:w-10 sm:h-10',
};

function handleImageSize(variant: string) {
  let size: number = 0;
  if (variant === 'large') {
    size = 40;
  } else if (variant === 'medium') {
    size = 32;
  } else {
    size = 24;
  }
  return size;
}

export default function ListCard({
  item,
  className = 'p-3 tracking-wider rounded-lg sm:p-4',
  variant = 'small',
}: CardProps) {
  const { name, logo, balance, coinType } = item ?? {};
  return (
    <div
      className={cn(
        'flex items-center justify-between bg-white text-sm font-medium shadow-card dark:bg-light-dark',
        className
      )}
    >
      <div className="flex items-center">
        <div className={cn('rounded-full', variants[variant])}>
          <Image
            src={logo}
            alt={name}
            width={handleImageSize(variant)}
            height={handleImageSize(variant)}
          />
        </div>

        <div className="ltr:ml-2 rtl:mr-2">
          {name}
          {coinType && (
            <span className="block pt-0.5 text-xs font-normal capitalize text-gray-600 dark:text-gray-400">
              {coinType}
            </span>
          )}
        </div>
      </div>
      <div className="overflow-hidden text-ellipsis -tracking-wider ltr:pl-2 rtl:pr-2">
        {balance}
      </div>
    </div>
  );
}
