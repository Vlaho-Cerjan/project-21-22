import type {DetailedHTMLProps} from 'react';

export default function Description({
  children,
  className,
  ...props
}: DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
  return (
    <span {...props} className={`description ${className ?? ''}`}>
      {children}
    </span>
  );
}
