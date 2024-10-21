import type {DetailedHTMLProps} from 'react';

export default function OrderTitle({
  children,
  className,
  ...props
}: DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
  return (
    <span {...props} className={`orderTitle ${className ?? ''}`}>
      {children}
    </span>
  );
}
