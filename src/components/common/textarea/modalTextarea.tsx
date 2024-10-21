import React, {
  type DetailedHTMLProps,
  type TextareaHTMLAttributes,
} from 'react';

export default function ModalTextArea({
  duplicateId,
  ...props
}: DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  duplicateId?: string;
}) {
  const txtId = props.id || Math.random().toString(36).substring(7).toString();
  const setHeight = (ignoreDuplicate?: boolean) => {
    const textarea = document.getElementById(txtId);
    const duplicate = document.getElementById(duplicateId || '');
    if (textarea) {
      // auto resize textarea based on content
      textarea.style.height = 'auto';
      textarea.style.height = `${
        textarea.scrollHeight !== 0 ? `${textarea.scrollHeight}px` : 'auto'
      }`;
      if (
        duplicate &&
        !ignoreDuplicate &&
        textarea.scrollHeight < duplicate.scrollHeight
      ) {
        textarea.style.height = `${duplicate.scrollHeight}px`;
      }
    }
  };

  React.useEffect(() => {
    setHeight();
  }, []);

  React.useEffect(() => {
    const textarea = document.getElementById(txtId);

    if (textarea) {
      setHeight();
    }
  }, [props.value]);

  return (
    <div className="modalTextareaControl">
      <textarea
        {...props}
        id={txtId}
        rows={1}
        onInput={(e) => {
          setHeight(true);
          if (props.onInput) {
            props.onInput(e);
          }
        }}
      />
    </div>
  );
}
