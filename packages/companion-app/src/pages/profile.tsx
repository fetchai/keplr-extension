import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import Image from '@/components/ui/image';
import Avatar from '@/components/ui/avatar';
import Profile from '@/components/profile/profile';
import RetroProfile from '@/components/profile/retro-profile';
// static data
import { authorData } from '@/data/static/author';
import RootLayout from '@/layouts/_root-layout';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const AuthorProfilePage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { layout } = useLayout();

  // render retro layout profile
  if (layout === LAYOUT_OPTIONS.RETRO) {
    return (
      <>
        <NextSeo
          title="Profile"
          description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
        />
        <div className="relative h-36 w-full overflow-hidden rounded-lg sm:h-44 md:h-64 xl:h-80 2xl:h-96 3xl:h-[448px]">
          <Image
            src={authorData?.cover_image?.thumbnail}
            placeholder="blur"
            fill
            className="h-full w-full object-cover"
            alt="Cover Image"
          />
        </div>
        <div className="mx-auto flex w-full shrink-0 flex-col md:px-4 xl:px-6 3xl:max-w-[1700px] 3xl:px-12">
          <Avatar
            size="xl"
            image={authorData?.avatar?.thumbnail}
            alt="Author"
            className="z-10 mx-auto -mt-12 dark:border-gray-500 sm:-mt-14 md:mx-0 md:-mt-16 xl:mx-0 3xl:-mt-20"
          />
          <RetroProfile />
        </div>
      </>
    );
  }

  // render default profile
  return (
    <>
      <NextSeo
        title="Profile"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="relative h-36 w-full overflow-hidden rounded-lg sm:h-44 md:h-64 xl:h-80 2xl:h-96 3xl:h-[448px]">
        <Image
          src={authorData?.cover_image?.thumbnail}
          placeholder="blur"
          fill
          className="object-cover"
          alt="Cover Image"
        />
      </div>
      <div className="mx-auto flex w-full shrink-0 flex-col md:px-4 xl:px-6 3xl:max-w-[1700px] 3xl:px-12">
        <Avatar
          size="xl"
          image={authorData?.avatar?.thumbnail}
          alt="Author"
          className="z-10 mx-auto -mt-12 dark:border-gray-500 sm:-mt-14 md:mx-0 md:-mt-16 xl:mx-0 3xl:-mt-20"
        />
        <Profile />
      </div>
    </>
  );
};

AuthorProfilePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default AuthorProfilePage;
