import dynamic from 'next/dynamic';
import type {DetailedHTMLProps, InputHTMLAttributes} from 'react';

import MemoDownArrow from '@/src/icons/down-arrow';

import NoStyleButton from '../button/noStyleButton';

const RcDropdownLazy = dynamic(() => import('rc-dropdown'), {ssr: false});

export default function ModalSelect({
  options,
  ...props
}: DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  options: any[];
}) {
  return (
    <RcDropdownLazy
      trigger={['click']}
      minOverlayWidthMatchTrigger
      overlayClassName={`modalSelectOverlay${props.name ? ` ${`modalSelectOverlay_${props.name}`}` : ''}`}
      overlay={
        <div data-testid="modalSelectOptions" className="modalSelectOptions">
          <div
            data-testid="modalSelectOptionsWrapper"
            className="modalSelectOptionsWrapper"
          >
            {options.map((option) => (
              <NoStyleButton
                key={option.id}
                className="modalSelectOption"
                disabled={option.disabled}
                data-testid={`modalSelectOption_${option.id}`}
                onClick={() => {
                  if (props.onChange) {
                    const e = {
                      currentTarget: {
                        value: option.id,
                        name: props.value,
                      },
                    };
                    props.onChange(e as any);
                  }
                }}
              >
                {option.name}
              </NoStyleButton>
            ))}
          </div>
        </div>
      }
    >
      <div
        data-testid={`dropdownButton_${props.name}`}
        className="modalControl modalSelectControl"
      >
        <input {...props} type="hidden" />
        <div data-testid="modalSelect" className="modalSelect">
          <span data-testid="modalSelectText" className="modalSelectText">
            {options.find((option) => option.id === props.value)?.name}
          </span>
        </div>
        <div data-testid="inputFuzzyIcon" className="inputFuzzyIcon">
          <MemoDownArrow />
        </div>
      </div>
    </RcDropdownLazy>
  );
}
