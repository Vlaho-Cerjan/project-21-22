import type {FuseOptionKey, FuseResult} from 'fuse.js';
import React from 'react';
import {setTimeout} from 'timers';
import {useWindowSize} from 'usehooks-ts';

import MemoClear from '@/src/icons/clear';
import MemoSearch from '@/src/icons/search';
import ItemMatches from '@/src/utils/ItemMatcher';
import matchEl from '@/src/utils/MatchEl';

import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import ClearButton from '../button/clearButton';
import Description from '../description/description';
import IconButton from '../iconButton/iconButton';
import Modal from '../modal/modal';
import Title from '../title/title';

interface ModalSelectFuzzyProps {
  dataTestId: string;
  dropdownId: string;
  openSearch: boolean;
  setOpenSearch:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((open: boolean) => void);
  data: any[];
  searchKeys: FuseOptionKey<any>[];
  displayValue: string;
  display: {
    topLeft: string;
    topRight?: string;
    bottomLeft?: string | string[];
    bottomRight?: string;
  };
  displayStartLimit: number;
  value: {
    id: string | number;
    name: string;
  } | null;
  setValue: (data: {id: string | number; name: string}) => void;
  dataName: string;
}

export default function ModalSelectFuzzy<
  T extends {
    id: string | number;
    recent?: boolean;
  },
>({
  dataTestId,
  dropdownId,
  openSearch,
  setOpenSearch,
  data,
  searchKeys,
  displayValue,
  display,
  displayStartLimit = 5,
  //value,
  setValue,
  dataName,
}: ModalSelectFuzzyProps) {
  const [searchText, setSearchText] = React.useState('');
  const [fuzzyData, setFuzzyData] = React.useState<FuseResult<any>[]>([]);
  const {width} = useWindowSize();
  const [seeAll, setSeeAll] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [maxItems, setMaxItems] = React.useState(displayStartLimit);
  const [maxItemsTemp, setMaxItemsTemp] = React.useState(displayStartLimit);

  React.useEffect(() => {
    if (data && data.length > 0) {
      setFuzzyData(
        data.map((item, index) => ({
          item,
          score: 0,
          matches: [],
          refIndex: index + 1,
        })),
      );
    }
  }, [data]);

  React.useEffect(() => {
    if (openSearch) setTimeout(() => setVisible(true), 50);
  }, [openSearch]);

  React.useEffect(() => {
    // if clicked outside of the dropdown, close the dropdown
    const clickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById(dropdownId);
      const dropdownParent = document.getElementById(
        `modalSelectLabelFuzzyContainer_${dropdownId}`,
      );
      if (e.target && dropdown && dropdownParent) {
        if (
          e.target === dropdown ||
          e.target === dropdownParent ||
          (e.target as HTMLElement).closest(`#${dropdownId}`) ||
          (e.target as HTMLElement).closest(
            `#modalSelectLabelFuzzyContainer_${dropdownId}`,
          ) ||
          (e.target as HTMLElement).closest(`#modal_${dropdownId}`)
        ) {
          return;
        }
        setOpenSearch(false);
      }
    };

    window.addEventListener('click', clickOutside);

    return () => {
      window.removeEventListener('click', clickOutside);
    };
  }, []);

  const setHeightFn = () => {
    const mainDropdownContainer = document.getElementById(dropdownId);
    const fuzzyDataHeight = maxItemsTemp * 50 + 19;
    const recentDataHeight =
      fuzzyData
        .filter(
          (item) => typeof item.item.recent !== 'undefined' && item.item.recent,
        )
        .slice(0, 2).length *
        50 +
      17;
    const section = mainDropdownContainer?.querySelector(
      '.main.searchSectionContainer',
    );
    const recent = mainDropdownContainer?.querySelector(
      '.recent.searchSectionContainer',
    );
    section?.setAttribute('style', `height: ${fuzzyDataHeight}px;`);
    recent?.setAttribute('style', `height: ${recentDataHeight}px;`);
  };

  useDidUpdateEffect(() => {
    if (!openSearch) {
      setTimeout(() => {
        setSeeAll(false);
        setHeightFn();
        setMaxItems(displayStartLimit);
        setMaxItemsTemp(displayStartLimit);
        setSearchText('');
        setVisible(false);
      }, 250);
    } else {
      //setSearchText(value?.name || '');
    }
  }, [openSearch]);

  React.useEffect(() => {
    if (fuzzyData.length === 0) return;
    const mainDropdownContainer = document.getElementById(dropdownId);
    const fuzzyDataHeight = maxItemsTemp * 50 + 19;
    const recentDataHeight =
      fuzzyData
        .filter(
          (item) => typeof item.item.recent !== 'undefined' && item.item.recent,
        )
        .slice(0, 2).length *
        50 +
      17;
    if (mainDropdownContainer && visible) {
      const section = mainDropdownContainer.querySelector(
        '.main.searchSectionContainer',
      );
      const recent = mainDropdownContainer.querySelector(
        '.recent.searchSectionContainer',
      );
      if (seeAll) {
        section?.setAttribute('style', `height: ${fuzzyDataHeight}px;`);
        recent?.setAttribute('style', `height: 0px;`);
        // mainDropdownContainer.setAttribute(
        //  'style',
        //  `max-height: ${initHeight}px;`,
        // );
      } else {
        section?.setAttribute('style', `height: ${fuzzyDataHeight}px;`);
        recent?.setAttribute('style', `height: ${recentDataHeight}px;`);
      }
    }
  }, [maxItemsTemp, fuzzyData]);

  const handleSearch = async (dataTemp: T[], searchTextTemp?: string) => {
    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(dataTemp, {
      keys: searchKeys,
      includeMatches: true,
    });
    if (searchTextTemp) setFuzzyData(fuse.search(searchTextTemp));
    else if (dataTemp && dataTemp.length > 0)
      setFuzzyData(
        dataTemp.map((item, index) => ({
          item,
          score: 0,
          matches: [],
          refIndex: index + 1,
        })),
      );
    else setFuzzyData([]);
  };

  useDidUpdateEffect(() => {
    handleSearch(data, searchText);
  }, [searchText]);

  useDidUpdateEffect(() => {
    const fuzzyDataLength =
      fuzzyData.length !== 0 ? fuzzyData.length : displayStartLimit;
    if (seeAll) {
      setMaxItems(fuzzyDataLength);
      setMaxItemsTemp(fuzzyDataLength);
    } else {
      setMaxItemsTemp(
        fuzzyData.length < displayStartLimit
          ? fuzzyDataLength
          : displayStartLimit,
      );
      setTimeout(() => {
        setMaxItems(
          fuzzyData.length < displayStartLimit
            ? fuzzyDataLength
            : displayStartLimit,
        );
      }, 250);
    }
  }, [seeAll]);

  useDidUpdateEffect(() => {
    const searchDropdownContainer = document.getElementById(dropdownId);
    if (seeAll) {
      searchDropdownContainer?.classList.add('seeAll');
    } else {
      searchDropdownContainer?.classList.remove('seeAll');
    }
  }, [seeAll]);

  const itemDropdownFunction = (item: FuseResult<any>) => {
    setSearchText(item.item[displayValue] as string);
    setValue({
      id: item.item.id,
      name: item.item[displayValue] as string,
    });
    setOpenSearch(false);
  };

  const dropdownData = React.useMemo(() => {
    const dropdownItem = (item: FuseResult<any>) => {
      return (
        <>
          <div className="dropdownItemLeft">
            <div className="dropdownContent">
              <Title>
                {matchEl(
                  item.item[display.topLeft] as string,
                  ItemMatches(item.matches || [], display.topLeft as string),
                )}
              </Title>
              {display && display.bottomLeft && (
                <Description>
                  <span>
                    {matchEl(
                      item.item[
                        Array.isArray(display.bottomLeft)
                          ? display.bottomLeft[0] || ''
                          : display.bottomLeft || ''
                      ] as string,
                      ItemMatches(
                        item.matches || [],
                        (Array.isArray(display.bottomLeft)
                          ? display.bottomLeft[0]
                          : display.bottomLeft) as string,
                      ),
                    )}
                    {Array.isArray(display.bottomLeft)
                      ? typeof item.item[display.bottomLeft[0] || ''] ===
                          'number' && ` ${String(display.bottomLeft[0])}`
                      : typeof item.item[display.bottomLeft] === 'number' &&
                        ` ${String(display.bottomLeft)}`}
                    {Array.isArray(display.bottomLeft) && (
                      <>
                        {` / `}
                        {matchEl(
                          (item.item[display.bottomLeft[1] || ''] as string) ||
                            '',
                          ItemMatches(
                            item.matches || [],
                            display.bottomLeft[1] as string,
                          ),
                        )}
                        {typeof item.item[display.bottomLeft[1] || ''] ===
                          'number' && ` ${String(display.bottomLeft[1])}`}
                      </>
                    )}
                  </span>
                </Description>
              )}
            </div>
          </div>
          {typeof display.topRight !== 'undefined' && (
            <div className="dropdownItemRight">
              <Description>
                <span>
                  {matchEl(
                    display.topRight
                      ? (item.item[display.topRight] as string)
                      : '',
                    ItemMatches(
                      item.matches || [],
                      (display.topRight as string) || '',
                    ),
                  )}
                  {typeof item.item[display.topRight] === 'number' &&
                    ` ${String(display.topRight)}`}
                </span>
              </Description>
              {display.bottomRight && (
                <Description>
                  <span>
                    {matchEl(
                      display.bottomRight
                        ? (item.item[display.bottomRight] as string)
                        : '',
                      ItemMatches(
                        item.matches || [],
                        (display.bottomRight as string) || '',
                      ),
                    )}
                    {typeof item.item[display.bottomRight] === 'number' &&
                      ` ${String(display.bottomRight)}`}
                  </span>
                </Description>
              )}
            </div>
          )}
        </>
      );
    };
    return (
      <div
        id={dropdownId}
        className={`main searchDropdownContainer${seeAll ? ' seeAll' : ''}${
          openSearch &&
          (visible ||
            (fuzzyData &&
              fuzzyData.length > 0 &&
              fuzzyData
                .filter(
                  (item) =>
                    typeof item.item.recent !== 'undefined' && item.item.recent,
                )
                .slice(0, 2).length > 0))
            ? ' visible'
            : ''
        }`}
      >
        <div className="searchDropdownWrapper">
          {visible && (
            <div
              className={`main searchSectionContainer${
                seeAll ? ' visible' : ''
              }`}
            >
              <div className="searchDropdownHeader">
                <div className="searchDropdownTitle">
                  {dataName}
                  <span
                    className={`resultCount${
                      fuzzyData.length <= 5 ? ' hidden' : ''
                    }`}
                  >
                    {fuzzyData.length}
                  </span>
                </div>
                <div className="searchDropdownButtonContainer">
                  <ClearButton
                    onClick={() => {
                      if (seeAll === false) setHeightFn();
                      setSeeAll(!seeAll);
                    }}
                    className={`${
                      fuzzyData.length <= displayStartLimit ? ' hidden' : ''
                    }`}
                  >
                    {seeAll ? 'See Less' : 'See All'}
                  </ClearButton>
                </div>
              </div>
              <div className="searchDropdownDataContainer">
                {fuzzyData && fuzzyData.length > 0 ? (
                  fuzzyData.slice(0, maxItems).map((item) => {
                    return (
                      <button
                        type="button"
                        className="dropdownItem"
                        data-testid={`dropdownItem_${item.item.name.replaceAll(' ', '')}`}
                        onClick={() => itemDropdownFunction(item)}
                        key={`${item.item.id}_${item.item[displayValue]}`}
                      >
                        {dropdownItem(item)}
                      </button>
                    );
                  })
                ) : (
                  <div className="noResults">
                    <Title>No results found</Title>
                  </div>
                )}
              </div>
            </div>
          )}
          {fuzzyData &&
            fuzzyData.length > 0 &&
            fuzzyData
              .filter(
                (item) =>
                  typeof item.item.recent !== 'undefined' && item.item.recent,
              )
              .slice(0, 2).length > 0 && (
              <div className="recent searchSectionContainer">
                <div className="searchDropdownHeader">
                  <div className="searchDropdownTitle">Recent</div>
                </div>
                <div className="searchDropdownDataContainer">
                  {fuzzyData
                    .filter(
                      (item) =>
                        typeof item.item.recent !== 'undefined' &&
                        item.item.recent,
                    )
                    .slice(0, 2)
                    .map((item) => {
                      return (
                        <button
                          type="button"
                          data-testid={`${item.item.id}_recent`}
                          className="dropdownItem"
                          onClick={() => itemDropdownFunction(item)}
                          key={`${item.item.id}_${item.item[displayValue]}`}
                        >
                          {dropdownItem(item)}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }, [
    openSearch,
    dropdownId,
    fuzzyData,
    searchText,
    setSearchText,
    setOpenSearch,
    width,
    seeAll,
    maxItems,
    visible,
  ]);

  return (
    <Modal
      closeOnOutsideClick
      wrapperClassName="visible"
      wrapperTestId={`selectFuzzyModal_${dropdownId}`}
      // closeOnClickFn={() => {
      //  if (searchText === '' || value !== null) {
      //    setOpenSearch(false);
      //  }
      // }}
      noCloseBtn
      id={`modal_${dropdownId}`}
      className={`selectFuzzyModal searchModal${seeAll ? ' seeAll' : ''}${
        openSearch ? ' visible' : ''
      } maxWidthNormal`}
      open={openSearch}
      setOpen={setOpenSearch}
    >
      <div
        className={`searchModalContainer${openSearch ? ' visibleDrop' : ''}`}
      >
        <div className="inputContainer">
          <div className="inputContent">
            <div className="searchIconContainer">
              <MemoSearch />
            </div>
            <input
              data-testid={`searchModalInput_${dataTestId}`}
              placeholder="Search"
              className="modalInput"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                // setValue({
                //  id: '',
                //  name: '',
                // });
              }}
            />
            <IconButton
              data-tooltip-id="clearSearch1"
              data-tooltip-content="Clear Search"
              containerProps={{
                className: 'clearIconContainer',
              }}
              className="clearIconButton"
              icon={<MemoClear />}
              onClick={() => {
                setSeeAll(false);
                if (searchText === '') setOpenSearch(false);
                else {
                  setSearchText('');
                  // setValue({
                  //  id: '',
                  //  name: '',
                  // });
                }
                setTimeout(() => {
                  setHeightFn();
                }, 250);
              }}
            />
          </div>
        </div>
        {dropdownData}
      </div>
    </Modal>
  );
}
