'use client';

import {useEffect, useState} from 'react';

import MemoEye from '@/src/icons/eye';

export default function PassEyeButton({
  passInputName,
  icon,
  state,
  setState,
  setType,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  passInputName?: string;
  icon?: React.ReactNode;
  state?: boolean;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
  setType?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [passInput, setPassInput] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = document.querySelector(
      `input[name=${passInputName}]`,
    ) as HTMLInputElement;
    if (!passInput) setPassInput(input);
  }, []);

  return (
    <button
      id={`eyeButton_${passInputName || Math.random().toString(36).substring(7)}`}
      className="iconButton"
      onClick={(e) => {
        if (typeof setState === 'function') {
          if (state) {
            e.currentTarget.classList.remove('active');
          } else {
            e.currentTarget.classList.add('active');
          }
          setState(!state);
        } else if (passInput && passInput.type === 'password') {
          passInput.type = 'text';
          e.currentTarget.classList.add('active');
          if (setType) setType('text');
        } else if (passInput && passInput.type === 'text') {
          passInput.type = 'password';
          e.currentTarget.classList.remove('active');
          if (setType) setType('password');
        }
      }}
      data-testid="eyeButton"
      title="Show password"
      type="button"
      {...props}
    >
      {icon || <MemoEye data-testid="defaultEyeIcon" aria-label="Eye icon" />}
    </button>
  );
}
