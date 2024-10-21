import type {FuseOptionKey} from 'fuse.js';
import dynamic from 'next/dynamic';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import MemoDownArrow from '@/src/icons/down-arrow';
import MemoLock from '@/src/icons/lock';
import InputValidationAll from '@/src/utils/InputValidationAll';

import ClearButton from '../button/clearButton';

/* dynamic import ModalSelectFuzzy with 1 argument for typing T */
const ModalSelectFuzzyLazy = dynamic(() => import('./modalSelectFuzzy'), {
  ssr: false,
}) as <T extends {id: string; name: string}>(
  props: React.PropsWithChildren<{
    dropdownId: string;
    openSearch: boolean;
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
    data: T[];
    searchKeys: FuseOptionKey<T>[];
    displayValue: string;
    display: {
      topLeft: string;
      topRight?: string;
      bottomLeft?: string | string[];
      // *** topRight has to be defined if bottomRight is defined ***
      bottomRight?: string;
    };
    displayStartLimit: number;
    value: {
      id: string;
      name: string;
    } | null;
    setValue: (data: T) => void;
    dataName: string;
  }>,
) => React.ReactElement;

export default function SelectFuzzy<
  T extends {
    id: string;
    name: string;
  },
>({
  selectProps,
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
  offset,
}: {
  data: {
    id: string;
    name: string;
  }[];
  searchData: T[];
  selectProps?: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & {
    'data-testid'?: string;
  };
  dropdownId: string;
  searchKeys: FuseOptionKey<T>[];
  displayValue: string;
  display: {
    topLeft: string;
    topRight?: string;
    bottomLeft?: string | string[];
    // *** topRight has to be defined if bottomRight is defined ***
    bottomRight?: string;
  };
  displayStartLimit: number;
  value: {
    id: string;
    name: string;
  } | null;
  setValue: (data: {id: string; name: string}) => void;
  dataName: string;
  locked?: boolean;
  selectTestDataId?: string;
  offset?: {
    left: number;
    top: number;
  };
}) {
  const [openSearch, setOpenSearch] = React.useState(false);
  const {width} = useWindowSize();

  const [is1200, setIs1200] = React.useState(false);

  React.useEffect(() => {
    if (width && width >= 1200) setIs1200(true);
    else setIs1200(false);
  }, [width]);

  React.useEffect(() => {
    // click outside to close the dropdown
    const clickOutside = (e: MouseEvent) => {
      if (
        openSearch &&
        !document
          .querySelector(`#modalSelectLabelFuzzyContainer_${dropdownId}`)
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
  }, [openSearch]);

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
  }, [openSearch]);

  const [maxSpanWidth, setMaxSpanWidth] = React.useState(0);

  React.useEffect(() => {
    const inputFuzzyContainer = document.querySelector(
      `#modalSelectLabelFuzzyContainer_${dropdownId}`,
    ) as HTMLDivElement;
    if (!inputFuzzyContainer) return;
    const fuzzyModal = inputFuzzyContainer.querySelector('.selectFuzzyModal');

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

        if (offset) {
          left += offset.left;
          top += offset.top;
        }

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
  }, [width, openSearch]);

  return (
    <div
      id={`modalSelectLabelFuzzyContainer_${dropdownId}`}
      className="formControl modalSelectLabelFuzzyContainer"
      style={{'--max-span-width': `${maxSpanWidth}px`} as React.CSSProperties}
    >
      <div className="inputFuzzyContainer">
        <div className="modalControl modalSelectControl">
          <select
            {...selectProps}
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
            {data &&
              data.length > 0 &&
              data.map((item) => (
                <option key={item.id} value={item.id}>
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
      <ModalSelectFuzzyLazy<(typeof searchData)[0]>
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
