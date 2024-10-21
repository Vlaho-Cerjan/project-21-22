import React from 'react';

const Input = React.forwardRef(function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  ref: React.Ref<HTMLInputElement>,
) {
  return (
    <div className="inputControl">
      <input {...props} ref={ref} />
    </div>
  );
});

export default Input;
