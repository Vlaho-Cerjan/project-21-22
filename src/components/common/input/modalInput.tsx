import type {DetailedHTMLProps, InputHTMLAttributes} from 'react';
import React from 'react';

export default function ModalInput({
  ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <div className="modalControl modalInputControl">
      <input {...props} />
    </div>
  );
}

export const ForwardedRefModalInput = React.forwardRef(
  function ForwardedRefModalInput(
    props: DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    ref: React.Ref<HTMLInputElement>,
  ) {
    return (
      <div className="modalControl modalInputControl">
        <input {...props} ref={ref} />
      </div>
    );
  },
);
