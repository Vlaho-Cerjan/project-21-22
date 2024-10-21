import React from 'react';

const TextArea = React.forwardRef(function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  return (
    <div className="inputControl">
      <textarea {...props} ref={ref} />
    </div>
  );
});

export default TextArea;
