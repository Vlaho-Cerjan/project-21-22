import type {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

export default function NoStyleButton({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button {...props} className={`button noStyle ${className ?? ''}`}>
      {children}
    </button>
  );
}
