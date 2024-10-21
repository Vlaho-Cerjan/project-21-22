import type {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

export default function ClearButton({
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
    <button
      type="button"
      {...props}
      className={`button clearButton ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
