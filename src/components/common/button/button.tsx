import type {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

export default function Button({
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
    <button {...props} className={`button ${className ?? ''}`}>
      {children}
    </button>
  );
}
