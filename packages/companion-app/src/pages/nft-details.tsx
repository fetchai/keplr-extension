import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import NftDetails from '@/components/nft/nft-details';
import { nftData } from '@/data/static/single-nft';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import MinimalNFTDetails from '@/components/nft/minimal-nft-details';
import RetroNFTDetails from '@/components/nft/retro-nft-details';
import ClassicNFTDetails from '@/components/nft/classic-nft-details';
import RootLayout from '@/layouts/_root-layout';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const NFTDetailsPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { layout } = useLayout();

  if (layout === LAYOUT_OPTIONS.MINIMAL) {
    return <MinimalNFTDetails product={nftData} />;
  }

  if (layout === LAYOUT_OPTIONS.RETRO) {
    return <RetroNFTDetails product={nftData} />;
  }

  if (layout === LAYOUT_OPTIONS.CLASSIC) {
    return <ClassicNFTDetails product={nftData} />;
  }

  return (
    <>
      <NextSeo
        title="NFT details"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <NftDetails product={nftData} />
    </>
  );
};

NFTDetailsPage.getLayout = function getLayout(page) {
  return <RootLayout contentClassName="!pb-0">{page}</RootLayout>;
};

export default NFTDetailsPage;
