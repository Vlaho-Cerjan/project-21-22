import type {FuseOptionKey} from 'fuse.js';
import dynamic from 'next/dynamic';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import MemoDownArrow from '@/src/icons/down-arrow';
import MemoLock from '@/src/icons/lock';
import InputValidationAll from '@/src/utils/InputValidationAll';

import ClearButton from '../button/clearButton';
import Label from '../label/label';

/* dynamic import ModalSelectFuzzy with 1 argument for typing T */
const ModalSelectFuzzyLazy = dynamic(() => import('./modalSelectFuzzy'), {
  ssr: false,
}) as <T extends {id: string | number; name: string}>(
  props: React.PropsWithChildren<{
    dataTestId: string;
    dropdownId: string;
    openSearch: boolean;
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
    data: T[];
    searchKeys: FuseOptionKey<T>[];
    displayValue: keyof T;
    display: {
      topLeft: keyof T;
      topRight?: keyof T;
      bottomLeft?: keyof T | [keyof T, keyof T];
      // *** topRight has to be defined if bottomRight is defined ***
      bottomRight?: keyof T;
    };
    displayStartLimit: number;
    value: {
      id: string | number;
      name: string;
    } | null;
    setValue: (data: T) => void;
    dataName: string;
  }>,
) => React.ReactElement;

export default function ModalSelectLabelFuzzy<
  T extends {
    id: string | number;
    name: string;
  },
>({
  labelText,
  labelProps,
  selectProps,
  errorText,
  data,
  searchData,
  dropdownId,
  searchKeys,
  displayValue,
  display,
  displayStartLimit,
  value,
  setValue,
  dataName,
  locked,
  selectTestDataId,
  inputTestId,
}: {
  labelText: string | React.ReactNode;
  data: {
    id: string | number;
    name: string;
  }[];
  searchData: T[];
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  selectProps?: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & {
    'data-testid'?: string;
  };
  errorText?: string;
  dropdownId: string;
  searchKeys: FuseOptionKey<T>[];
  displayValue: keyof T;
  display: {
    topLeft: keyof T;
    topRight?: keyof T;
    bottomLeft?: keyof T | [keyof T, keyof T];
    // *** topRight has to be defined if bottomRight is defined ***
    bottomRight?: keyof T;
  };
  displayStartLimit: number;
  value: {
    id: string | number;
    name: string;
  } | null;
  setValue: (data: {id: string | number; name: string}) => void;
  dataName: string;
  locked?: boolean;
  selectTestDataId?: string;
  inputTestId: string;
}) {
  const [openSearch, setOpenSearch] = React.useState(false);
  const {width} = useWindowSize();

  const [is1200, setIs1200] = React.useState(false);

  React.useEffect(() => {
    if (width && width >= 1200) setIs1200(true);
    else setIs1200(false);
  }, [width]);

  React.useEffect(() => {
    setTimeout(() => {
      const dropdownContainer = document.getElementById(`modal_${dropdownId}`);

      if (dropdownContainer) {
        document.body.appendChild(dropdownContainer);
      }
    }, 1000);
  }, [dropdownId]);

  React.useEffect(() => {
    // click outside to close the dropdown
    const clickOutside = (e: MouseEvent) => {
      if (
        openSearch &&
        !document
          .querySelector(`#modalSelectLabelFuzzyContainer_${dropdownId}`)
          ?.contains(e.target as Node) &&
        !document
          .querySelector(`#modal_${dropdownId}`)
          ?.contains(e.target as Node)
      ) {
        console.log('click outside');
        setOpenSearch(false);
      }
    };

    document.addEventListener('click', clickOutside);

    return () => {
      document.removeEventListener('click', clickOutside);
    };
  }, [dropdownId, openSearch]);

  React.useEffect(() => {
    const fixedParent = document
      .querySelector(`#${dropdownId}`)
      ?.closest('.modal.openModal:not(.searchModal)')
      ?.querySelector('.modalContent');
    if (openSearch) {
      fixedParent?.setAttribute('style', 'border-radius: 0');
    } else {
      fixedParent?.removeAttribute('style');
    }
  }, [dropdownId, openSearch]);

  const [maxSpanWidth, setMaxSpanWidth] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      const inputFuzzyContainer = document.querySelector(
        `#modalSelectLabelFuzzyContainer_${dropdownId}`,
      ) as HTMLDivElement;

      if (!inputFuzzyContainer) return;
      const fuzzyModal = document.getElementById(`modal_${dropdownId}`);

      if (is1200 && openSearch) {
        // position dropdown to the fuzzy input container and match the width
        if (fuzzyModal) {
          const inputFuzzyContainerRect =
            inputFuzzyContainer.getBoundingClientRect();

          // if fuzzy modal goes out of the screen on the bottom, move it to the top
          const fuzzyModalRect = fuzzyModal.getBoundingClientRect();
          // if fuzzy modal's height is greater than the window height, shrink it to fit the window and move it to the top

          let {left} = inputFuzzyContainerRect;
          let {top} = inputFuzzyContainerRect;
          let height = window.innerHeight;

          left = inputFuzzyContainerRect.left;
          top = inputFuzzyContainerRect.top;
          height = window.innerHeight;

          const offsetTop = fuzzyModal.offsetTop;
          const clientHeight = fuzzyModal.clientHeight;

          console.log(fuzzyModal, offsetTop, clientHeight, window.innerHeight);

          if (
            fuzzyModalRect.height > height &&
            inputFuzzyContainerRect.top - height + 64 > 0
          ) {
            fuzzyModal.setAttribute(
              'style',
              `top: 0; left: ${left}px; width: ${inputFuzzyContainerRect.width}px; height: ${height}px;`,
            );
          } else if (fuzzyModalRect.bottom > window.innerHeight) {
            if (top - fuzzyModalRect.height + 64 < 0) {
              fuzzyModal.setAttribute(
                'style',
                `top: 0; left: ${left}px; width: ${inputFuzzyContainerRect.width}px;`,
              );
            } else {
              fuzzyModal.setAttribute(
                'style',
                `top: ${
                  top - fuzzyModalRect.height + 64
                }px; left: ${left}px; width: ${inputFuzzyContainerRect.width}px;`,
              );
            }
          } else {
            fuzzyModal.setAttribute(
              'style',
              `top: ${top + 24}px; left: ${left}px; width: ${
                inputFuzzyContainerRect.width
              }px;`,
            );
          }

          setMaxSpanWidth(inputFuzzyContainerRect.width - 40);
        }
      } else {
        setMaxSpanWidth(0);
        if (fuzzyModal) {
          setTimeout(() => {
            fuzzyModal.removeAttribute('style');
          }, 500);
        }
      }
    }, 10);
  }, [width, openSearch]);

  return (
    <div
      id={`modalSelectLabelFuzzyContainer_${dropdownId}`}
      data-testid={`modalSelectLabelFuzzyContainer_${dropdownId}`}
      className="formControl modalSelectLabelFuzzyContainer"
      style={{'--max-span-width': `${maxSpanWidth}px`} as React.CSSProperties}
    >
      <div className="labelContainer">
        {typeof labelText === 'string' ? (
          <Label htmlFor={selectProps?.name} {...labelProps}>
            {labelText}
          </Label>
        ) : (
          labelText
        )}
      </div>
      <div className="inputFuzzyContainer">
        <div className="modalControl modalSelectControl">
          <select
            {...selectProps}
            disabled
            onChange={(e) => {
              const errorEl = document.querySelector(
                `.errorContainer.${selectProps?.name}`,
              );
              if (InputValidationAll([e.currentTarget], [errorEl])) {
                e.currentTarget.classList.remove('error');
                errorEl?.classList.remove('active');
                errorEl?.removeAttribute('style');
              }

              if (selectProps && typeof selectProps.onChange === 'function')
                selectProps.onChange(e);
            }}
          >
            {data.map((item) => (
              <option
                selected={value?.id === item.id}
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="inputFuzzyIcon">
          {locked ? <MemoLock /> : <MemoDownArrow />}
        </div>
        <ClearButton
          data-testid={selectTestDataId}
          disabled={locked}
          onClick={() => setOpenSearch(true)}
        >
          Click to search
        </ClearButton>
      </div>
      <div className={`errorContainer ${selectProps?.name}`}>
        <div className="error">{errorText}</div>
      </div>
      <ModalSelectFuzzyLazy<(typeof searchData)[0]>
        dataTestId={inputTestId}
        dropdownId={dropdownId}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        data={searchData}
        searchKeys={searchKeys}
        displayValue={displayValue}
        display={display}
        displayStartLimit={displayStartLimit}
        value={value}
        setValue={setValue}
        dataName={dataName}
      />
    </div>
  );
}
