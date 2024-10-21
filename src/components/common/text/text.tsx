import type {DetailedHTMLProps} from 'react';

export default function Text({
  children,
  className,
  ...props
}: DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
  return (
    <span {...props} className={`text ${className ?? ''}`}>
      {children}
    </span>
  );
}
