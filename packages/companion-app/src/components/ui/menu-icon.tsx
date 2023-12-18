import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import lightLogo from '@/assets/images/menu.svg';
import darkLogo from '@/assets/images/menu-dark.svg';

const Logo: React.FC<React.SVGAttributes<{}>> = (props) => {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();

  return (
    <div className="flex cursor-pointer outline-none" {...props}>
      <span className="relative flex overflow-hidden">
        {isMounted && isDarkMode && (
          <Image src={darkLogo} alt="Criptic" priority fill />
        )}
        {isMounted && !isDarkMode && (
          <Image src={lightLogo} alt="Criptic" priority fill />
        )}
      </span>
    </div>
  );
};

export default Logo;
