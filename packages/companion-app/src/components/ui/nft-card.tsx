import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { Verified } from '@/components/icons/verified';
import Avatar from '@/components/ui/avatar';
import { StaticImageData } from 'next/image';

type NFTGridProps = {
  author: string;
  authorImage: StaticImageData;
  image: StaticImageData;
  name: string;
  collection: string;
  price: string;
};

export default function NFTGrid({
  author,
  authorImage,
  image,
  name,
  collection,
  price,
}: NFTGridProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark">
      <div className="p-4">
        <AnchorLink
          href="/"
          className="flex items-center text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <Avatar
            image={authorImage}
            alt={name}
            size="sm"
            className="text-ellipsis ltr:mr-3 rtl:ml-3 dark:border-gray-500"
          />
          <span className="overflow-hidden text-ellipsis">@{author}</span>
        </AnchorLink>
      </div>
      <AnchorLink href="/nft-details" className="relative block w-full">
        <Image src={image} placeholder="blur" width={450} height={450} alt="" />
      </AnchorLink>

      <div className="p-5">
        <AnchorLink
          href="/nft-details"
          className="text-sm font-medium text-black dark:text-white"
        >
          {name}
        </AnchorLink>
        <div className="mt-1.5 flex">
          <AnchorLink
            href="/"
            className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400"
          >
            {collection}
            <Verified className="ltr:ml-1 rtl:mr-1" />
          </AnchorLink>
        </div>
        <div className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          {price}
        </div>
      </div>
    </div>
  );
}
