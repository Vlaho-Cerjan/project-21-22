import type {LinkProps} from 'next/link';
import Link from 'next/link';

export default function StyledLink({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<React.AnchorHTMLAttributes<LinkProps>, LinkProps> & {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // @ts-expect-error - href is required
    <Link {...props} className={`link ${className ?? ''}`}>
      {children}
    </Link>
  );
}
