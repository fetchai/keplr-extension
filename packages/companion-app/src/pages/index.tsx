import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import type { NextPageWithLayout } from '@/types';
import RootLayout from '@/layouts/_root-layout';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import ModernScreen from '@/components/screens/modern-screen';
import MinimalScreen from '@/components/screens/minimal-screen';
import ClassicScreen from '@/components/screens/classic-screen';
import RetroScreen from '@/components/screens/retro-screen';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const HomePage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { layout } = useLayout();

  // render minimal screen/page
  if (layout === LAYOUT_OPTIONS.MINIMAL) {
    return <MinimalScreen />;
  }

  // render classic screen/page
  if (layout === LAYOUT_OPTIONS.CLASSIC) {
    return <ClassicScreen />;
  }

  // render retro screen/page
  if (layout === LAYOUT_OPTIONS.RETRO) {
    return <RetroScreen />;
  }

  // render default screen/page which is modern
  return <ModernScreen />;
};

HomePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default HomePage;
