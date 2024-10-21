import type {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

export default function WhiteButton({
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
    <button {...props} className={`button whiteButton ${className ?? ''}`}>
      {children}
    </button>
  );
}
