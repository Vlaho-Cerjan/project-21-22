import type {DetailedHTMLProps} from 'react';

export default function Divider({
  ...props
}: DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>) {
  return (
    <hr
      {...props}
      className={`divider${props.className ? ` ${props.className}` : ''}`}
    />
  );
}

export function ModalDivider({
  ...props
}: DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>) {
  return (
    <hr
      {...props}
      className={`divider modalDivider${
        props.className ? ` ${props.className}` : ''
      }`}
    />
  );
}
