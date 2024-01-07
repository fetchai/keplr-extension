import dynamic from 'next/dynamic';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import Loader from '@/components/ui/loader';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
// dynamic imports
const MinimalLayout = dynamic(() => import('@/layouts/_minimal'), {
  loading: () => <FallbackLoader />,
});
const ClassicLayout = dynamic(() => import('@/layouts/_classic'), {
  loading: () => <FallbackLoader />,
});
const RetroLayout = dynamic(() => import('@/layouts/_retro'), {
  loading: () => <FallbackLoader />,
});
const ModernLayout = dynamic(() => import('@/layouts/_modern'), {
  loading: () => <FallbackLoader />,
});

function FallbackLoader() {
  return (
    <div className="fixed z-50 grid h-full w-full place-content-center">
      <Loader variant="blink" />
    </div>
  );
}

export default function RootLayout({
  children,
  contentClassName,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
  const isMounted = useIsMounted();
  const { layout } = useLayout();

  // fix the `Hydration failed because the initial UI does not match` issue
  if (!isMounted) return null;

  // render minimal layout
  if (layout === LAYOUT_OPTIONS.MINIMAL) {
    return <MinimalLayout>{children}</MinimalLayout>;
  }

  // render retro layout
  if (layout === LAYOUT_OPTIONS.RETRO) {
    return (
      <RetroLayout contentClassName={contentClassName}>{children}</RetroLayout>
    );
  }

  // render classic layout
  if (layout === LAYOUT_OPTIONS.CLASSIC) {
    return (
      <ClassicLayout contentClassName={contentClassName}>
        {children}
      </ClassicLayout>
    );
  }

  // render default layout which is modern
  return (
    <ModernLayout contentClassName={contentClassName}>{children}</ModernLayout>
  );
}
