import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import AuthorInformation from '@/components/author/author-information';
import { authorData } from '@/data/static/author';
import { Check } from '@/components/icons/check';
import { Copy } from '@/components/icons/copy';
import Button from '@/components/ui/button';
import AnchorLink from '@/components/ui/links/anchor-link';
import Avatar from '@/components/ui/avatar';

export default function ProfileInfo() {
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard(authorData.wallet_key);
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }
  return (
    <div className="relative z-50 mx-auto w-[540px] max-w-full rounded-lg bg-white px-9 py-9 dark:bg-light-dark">
      <Avatar
        size="lg"
        image={authorData?.avatar?.thumbnail}
        alt="Author"
        className="mb-4 dark:border-gray-500 md:mx-0 xl:mx-0"
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-md font-medium tracking-tighter text-gray-900 dark:text-white xl:text-lg">
            {authorData?.name}
          </h2>
          <div className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            Joined {authorData?.created_at}
          </div>
        </div>
        <Button
          color="white"
          className="shadow-card dark:bg-light-dark md:h-10 md:px-5 xl:h-12 xl:px-7"
        >
          Follow
        </Button>
      </div>
      <div className="py-4 ltr:text-left rtl:text-right">
        {authorData?.socials?.map((social: any) => (
          <AnchorLink
            href={social?.link}
            className="mb-2 inline-flex pr-2 text-sm tracking-tight text-gray-600 transition last:mb-0 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            key={social?.id}
          >
            {social?.icon}
          </AnchorLink>
        ))}
      </div>
      <div className="mb-8 inline-flex h-9 w-full items-center rounded-full bg-white shadow-card dark:bg-light-dark">
        <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full bg-gray-900 px-4 text-xs text-white sm:text-sm">
          #{authorData?.id}
        </div>
        <div className="text truncate text-ellipsis bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:text-sm">
          {authorData?.wallet_key}
        </div>
        <div
          className="flex cursor-pointer items-center px-4 text-gray-500 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          title="Copy Address"
          onClick={() => handleCopyToClipboard()}
        >
          {copyButtonStatus ? (
            <Check className="h-auto w-3.5 text-green-500" />
          ) : (
            <Copy className="h-auto w-3.5" />
          )}
        </div>
      </div>
      <AuthorInformation
        className="ltr:text-left rtl:text-right md:block"
        data={authorData}
      />
    </div>
  );
}
