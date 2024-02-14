import type { LinkProps } from 'next/link';
import NextLink from 'next/link';
import cn from 'classnames';

const AnchorLink: React.FC<
  LinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
> = ({ ...props }) => {
  return <NextLink {...props} />;
};

export default AnchorLink;
