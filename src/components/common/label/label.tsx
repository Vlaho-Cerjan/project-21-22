import type {DetailedHTMLProps, LabelHTMLAttributes} from 'react';

export default function Label({
  children,
  ...props
}: DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>) {
  return (
    <label {...props} className={`label ${props.className}`}>
      {children}
    </label>
  );
}
