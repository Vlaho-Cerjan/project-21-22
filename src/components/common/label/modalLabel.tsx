import type {DetailedHTMLProps, LabelHTMLAttributes} from 'react';

export default function ModalLabel({
  children,
  ...props
}: DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>) {
  return (
    <div data-testid="labelContainer" className="labelContainer">
      <label {...props} className={`label modalLabel ${props.className}`}>
        {children}
      </label>
    </div>
  );
}
