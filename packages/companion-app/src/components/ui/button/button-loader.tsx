import Loader, {
  LoaderSizeTypes,
  LoaderVariantTypes,
} from '@/components/ui/loader';

export default function ButtonLoader({
  size,
  variant,
}: {
  size: LoaderSizeTypes;
  variant: LoaderVariantTypes;
}) {
  return (
    <span className="absolute inset-0 flex h-full w-full items-center justify-center">
      <Loader
        tag="span"
        size={size}
        variant={variant}
        showOnlyThreeDots={true}
      />
    </span>
  );
}

ButtonLoader.displayName = 'ButtonLoader';
