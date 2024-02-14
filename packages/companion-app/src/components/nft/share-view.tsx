import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
} from 'react-share';
import { Copy } from '@/components/icons/copy';
import { Instagram } from '@/components/icons/brands/instagram';
import { Twitter } from '@/components/icons/brands/twitter';
import { Facebook } from '@/components/icons/brands/facebook';
import { Telegram } from '@/components/icons/brands/telegram';

interface Props {
  nftSlug?: string;
}
export default function ShareView({ nftSlug = '#' }: Props) {
  const nftUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}`;
  let [copyButtonStatus, setCopyButtonStatus] = useState('Copy');
  let [_, copyToClipboard] = useCopyToClipboard();
  const handleCopyToClipboard = () => {
    copyToClipboard(nftUrl);
    setCopyButtonStatus('Copied!');
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 1000);
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-7 dark:border-gray-700 dark:bg-light-dark sm:px-7 sm:pb-8 sm:pt-6">
      <div className="text-lg font-medium uppercase -tracking-wide text-gray-900 ltr:text-left rtl:text-right dark:text-white lg:text-xl">
        Share this NFT
      </div>
      <div className="flex flex-wrap gap-2 pt-4 md:gap-2.5 xl:pt-5">
        <div className="product-share flex flex-shrink-0 flex-wrap items-center gap-2 md:gap-2.5">
          <TwitterShareButton url={nftUrl}>
            <span className="text-md flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 xl:h-14 xl:w-14">
              <Twitter className="h-5 w-5 lg:h-6 lg:w-6" />
            </span>
            <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">
              Twitter
            </span>
          </TwitterShareButton>
          <FacebookShareButton url={nftUrl}>
            <span className="text-md flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 xl:h-14 xl:w-14">
              <Facebook className="h-5 w-5 lg:h-6 lg:w-6" />
            </span>
            <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">
              Facebook
            </span>
          </FacebookShareButton>
          <TelegramShareButton url={nftUrl}>
            <span className="text-md flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 xl:h-14 xl:w-14">
              <Telegram className="h-5 w-5 lg:h-6 lg:w-6" />
            </span>
            <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">
              Telegram
            </span>
          </TelegramShareButton>

          <LinkedinShareButton url={nftUrl}>
            <span className="text-md flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 xl:h-14 xl:w-14">
              <Instagram className="h-5 w-5 lg:h-6 lg:w-6" />
            </span>

            <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">
              Linkedin
            </span>
          </LinkedinShareButton>
        </div>
        <button onClick={handleCopyToClipboard}>
          <span className="text-md flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 xl:h-14 xl:w-14">
            <Copy className="h-4 w-4 lg:h-5 lg:w-5" />
          </span>
          <span className="mt-2 block text-xs -tracking-widest text-gray-600 dark:text-gray-400">
            {copyButtonStatus}
          </span>
        </button>
      </div>
    </div>
  );
}
