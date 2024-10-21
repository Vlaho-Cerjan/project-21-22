import type {AgGridReact} from 'ag-grid-react';
import type {FuseResult} from 'fuse.js';
import Image from 'next/image';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import type {BackendPlaylistsData} from '@/src/constants/backendData';
import MemoClear from '@/src/icons/clear';
import MemoSearch from '@/src/icons/search';
import {GetTypeById} from '@/src/utils/GetTypeById';
import ItemMatches from '@/src/utils/ItemMatcher';
import matchEl from '@/src/utils/MatchEl';

import ClearButton from '../../common/button/clearButton';
import Description from '../../common/description/description';
import IconButton from '../../common/iconButton/iconButton';
import Modal from '../../common/modal/modal';
import Title from '../../common/title/title';

export default function CustomSearchModal({
  openSearch,
  setOpenSearch,
  searchText,
  setSearchText,
  setGridSearchText,
  data,
  dataTypes,
  displayKeys,
  gridRef,
}: {
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  data: FuseResult<BackendPlaylistsData>[];
  dataTypes: {
    id: string;
    name: string;
    defItems: number;
  }[];
  displayKeys: (
    | {
        id: keyof BackendPlaylistsData;
        position: 'top left' | 'top right' | 'bottom right';
      }
    | {
        id: (keyof BackendPlaylistsData)[];
        position: 'bottom left';
      }
  )[];
  setGridSearchText: React.Dispatch<React.SetStateAction<string>>;
  gridRef: React.MutableRefObject<AgGridReact | null>;
}) {
  const [seeAll, setSeeAll] = React.useState(
    dataTypes.map((item) => ({
      [item.id]: false,
    })),
  );

  const [maxItems, setMaxItems] = React.useState(
    dataTypes.map((item) => ({
      [item.id]: item.defItems,
    })),
  );

  const [maxItemsTemp, setMaxItemsTemp] = React.useState(
    dataTypes.map((item) => ({
      [item.id]: item.defItems,
    })),
  );
  // const transitionHeightRatio = 1.68;

  const {height} = useWindowSize();

  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (searchText.length > 2) setTimeout(() => setVisible(true), 250);
    else setVisible(false);
  }, [searchText]);

  React.useEffect(() => {
    if (!openSearch)
      setSeeAll(
        dataTypes.map((item) => ({
          [item.id]: false,
        })),
      );
  }, [openSearch]);

  React.useEffect(() => {
    const seeAllTrueItem = seeAll.find(
      (item) => Object.values(item)[0] === true,
    );
    const seeAllId = Object.keys(seeAllTrueItem || {})[0];
    if (typeof seeAllId === 'undefined') {
      setMaxItemsTemp(
        dataTypes.map((item) => ({
          [item.id]: item.defItems,
        })),
      );
      setTimeout(() => {
        setMaxItems(
          dataTypes.map((item) => ({
            [item.id]: item.defItems,
          })),
        );
      }, 250);
      return;
    }
    if (
      Object.values(
        seeAll.find((tempItem) => Object.keys(tempItem)[0] === seeAllId) || {},
      )[0] === true
    ) {
      const newMaxItemsData = maxItems.map((item) => {
        const max = Object.keys(item)[0];
        if (max === seeAllId) {
          return {
            [max]: data.filter((dataItem) => dataItem.item.type === seeAllId)
              .length,
          };
        }
        return item;
      });
      setMaxItems(newMaxItemsData);
      setMaxItemsTemp(newMaxItemsData);
    } else {
      const newMaxItemsData = maxItems.map((item) => {
        const max = Object.keys(item)[0];
        if (max === seeAllId) {
          return {
            [max]:
              dataTypes.find((tempItem) => tempItem.id === seeAllId)
                ?.defItems || 3,
          };
        }
        return item;
      });
      setMaxItemsTemp(newMaxItemsData);
      setTimeout(() => {
        setMaxItems(newMaxItemsData);
      }, 250);
    }
  }, [seeAll]);

  React.useEffect(() => {
    maxItemsTemp.forEach((item) => {
      const max = Object.keys(item)[0];
      if (seeAll.find((tempItem) => Object.values(tempItem)[0] === true)) {
        return;
      }

      if (max) {
        const dataItem = document.getElementById(max);
        const dataLength = data.filter(
          (dataItemTemp) => dataItemTemp.item.type === max,
        ).length;
        const heightData =
          dataLength < (item[max] || 1) ? dataLength : item[max];
        const fuzzyDataHeight = (heightData || 1) * 50 - 10 + 29;
        const bodyHeight = document.body.clientHeight - 72;
        if (dataItem) {
          if (fuzzyDataHeight + 28 < bodyHeight) {
            dataItem.setAttribute('style', `height: ${fuzzyDataHeight}px`);
          } else {
            dataItem.setAttribute('style', `height: ${bodyHeight}px`);
          }
        }
      }
    });
  }, [data]);

  React.useEffect(() => {
    const mainContainer = document.getElementById('listFuzzySearch');
    maxItemsTemp.forEach((item) => {
      const max = Object.keys(item)[0];
      if (max) {
        const dataItem = document.getElementById(max);
        const otherElements: NodeListOf<HTMLElement> =
          document.querySelectorAll(
            `.searchSectionContainer:not(#searchSectionContainer_${max})`,
          );
        const dataLength = data.filter(
          (dataItemTemp) => dataItemTemp.item.type === max,
        ).length;
        const heightData =
          dataLength < (item[max] || 1) ? dataLength : item[max];
        const fuzzyDataHeight = (heightData || 1) * 50 - 10 + 29;
        // get current screen height
        const bodyHeight = window.innerHeight - 72;
        if (
          dataItem &&
          visible &&
          Object.values(
            seeAll.find((tempItem) => Object.keys(tempItem)[0] === max) || {},
          )[0] === true
        ) {
          otherElements.forEach((otherElement) => {
            otherElement.setAttribute('style', 'height: 0;');
          });
          if (fuzzyDataHeight + 28 < bodyHeight) {
            mainContainer?.setAttribute(
              'style',
              `height: ${fuzzyDataHeight + 28}px; overflow: hidden;`,
            );
            dataItem.setAttribute('style', `height: ${fuzzyDataHeight + 28}px`);
          } else {
            mainContainer?.setAttribute('style', `height: ${bodyHeight}px`);
            dataItem.setAttribute('style', `height: ${bodyHeight}px`);
          }
          setTimeout(() => {
            dataItem.setAttribute('style', `height: ${fuzzyDataHeight}px`);
          }, 250);
        }
      }
    });
  }, [maxItemsTemp]);

  const setHeightFun = () => {
    const mainContainer = document.getElementById('listFuzzySearch');
    const recent = document.getElementById('recent');
    const fuzzyDataHeightRecent =
      data
        .filter(
          (item) => typeof item.item.recent !== 'undefined' && item.item.recent,
        )
        .slice(0, 2).length *
        50 -
      10 +
      29;
    if (
      Object.values(seeAll).filter((item) => Object.values(item)[0] === true)
        .length === 0
    ) {
      mainContainer?.removeAttribute('style');
      maxItemsTemp.forEach((item) => {
        const max = Object.keys(item)[0];
        if (max) {
          const dataItem = document.getElementById(max);
          const dataLength = data.filter(
            (dataItemTemp) => dataItemTemp.item.type === max,
          ).length;
          const heightData =
            dataLength < (item[max] || 1) ? dataLength : item[max];
          const fuzzyDataHeight = (heightData || 1) * 50 - 10 + 29;
          dataItem?.setAttribute('style', `height: ${fuzzyDataHeight}px`);
        }
      });
      recent?.setAttribute('style', `height: ${fuzzyDataHeightRecent}px`);
    }
  };

  React.useEffect(() => {
    setHeightFun();
  }, [maxItemsTemp]);

  React.useEffect(() => {
    const mainContainer = document.getElementById('listFuzzySearch');
    mainContainer?.removeAttribute('style');
  }, [height]);

  React.useEffect(() => {
    const searchDropdownContainer = document.getElementById('listFuzzySearch');
    if (Object.values(seeAll).find((item) => Object.values(item)[0] === true)) {
      searchDropdownContainer?.classList.add('seeAll');
    } else {
      searchDropdownContainer?.classList.remove('seeAll');
    }
  }, [seeAll]);

  const itemDropdownFunction = (item: FuseResult<BackendPlaylistsData>) => {
    if (typeof setGridSearchText !== 'undefined')
      setGridSearchText(item.item.name || '');

    setOpenSearch(false);
    setTimeout(() => {
      setSearchText(item.item.name || '');
    }, 300);
  };

  const dropdownData = React.useMemo(() => {
    const dropdownItem = (item: FuseResult<BackendPlaylistsData>) => {
      return (
        <>
          <div className="dropdownItemLeft">
            <div className="dropdownIcon">
              <Image
                src={item.item.url || ''}
                alt={item.item.name}
                // 16/9 aspect
                height={32}
                width={57}
              />
            </div>
            <div className="dropdownContent">
              {displayKeys
                .filter((key) => key.position.includes('left'))
                .map((keyItem) => {
                  if (keyItem.position === 'top left') {
                    const keyEl = keyItem.id;
                    return (
                      <Title key={keyEl}>
                        {matchEl(
                          (item.item[keyItem.id] || '').toString() || '',
                          ItemMatches(item.matches || [], keyItem.id as string),
                        )}
                      </Title>
                    );
                  }
                  if (keyItem.position === 'bottom left') {
                    return (
                      <Description key={keyItem.id.join('_')}>
                        {keyItem.id.map((keyEl, index) => {
                          const typeString =
                            keyItem.id.toString() === 'type' && item.item.type
                              ? GetTypeById(item.item.type)?.name
                              : null;

                          const videosString =
                            keyItem.id.toString() === 'videos' &&
                            item.item.videos
                              ? `${item.item.videos.length.toString()} ${
                                  item.item.videos.length > 1
                                    ? 'videos'
                                    : 'video'
                                }`
                              : null;
                          return (
                            <span key={keyEl}>
                              {matchEl(
                                (
                                  typeString ||
                                  videosString ||
                                  item.item[keyEl] ||
                                  ''
                                ).toString() || '',
                                ItemMatches(
                                  item.matches || [],
                                  keyEl as string,
                                ),
                              )}
                              {index !== keyItem.id.length - 1 ? ` | ` : ''}
                            </span>
                          );
                        })}
                      </Description>
                    );
                  }
                  return null;
                })}
            </div>
          </div>
          <div className="dropdownItemRight">
            {displayKeys
              .filter((key) => key.position.includes('right'))
              .map((keyItem) => {
                return (
                  <Description key={keyItem.id as string}>
                    {matchEl(
                      (
                        item.item[keyItem.id as keyof BackendPlaylistsData] ||
                        ''
                      ).toString() || '',
                      ItemMatches(item.matches || [], keyItem.id as string),
                    )}
                  </Description>
                );
              })}
          </div>
        </>
      );
    };
    return (
      <div
        id="listFuzzySearch"
        className={`searchDropdownContainer${
          openSearch &&
          (data.filter((tempItem) => tempItem.item.recent).length > 1 ||
            searchText.length > 2)
            ? ' visible'
            : ''
        }${
          seeAll.find((item) => Object.values(item)[0] === true)
            ? ' seeAll'
            : ''
        }`}
      >
        <div className="searchDropdownWrapper">
          {dataTypes.map((item) => (
            <div
              key={item.id}
              id={`searchSectionContainer_${item.id}`}
              className={`searchSectionContainer${
                Object.values(
                  seeAll.find(
                    (tempItem) => Object.keys(tempItem)[0] === item.id,
                  ) || {},
                )[0]
                  ? ' visible'
                  : ''
              }`}
            >
              <div className="searchDropdownHeader">
                <div className="searchDropdownTitle">
                  {item.name}
                  <span
                    className={`resultCount${
                      data.filter((dataItem) => dataItem.item.type === item.id)
                        .length <= item.defItems
                        ? ' hidden'
                        : ''
                    }`}
                  >
                    {
                      data.filter((dataItem) => dataItem.item.type === item.id)
                        .length
                    }
                  </span>
                </div>
                <div className="searchDropdownButtonContainer">
                  <ClearButton
                    onClick={() => {
                      const mainContainer =
                        document.getElementById('listFuzzySearch');
                      if (mainContainer) {
                        mainContainer.setAttribute(
                          'style',
                          `height: ${mainContainer.clientHeight}px`,
                        );
                      }
                      const newSeeAllData = seeAll.map((seeAllItem) => {
                        const seeAllId = Object.keys(seeAllItem)[0];
                        if (seeAllId === item.id) {
                          return {
                            [seeAllId]: !seeAllItem[seeAllId],
                          };
                        }
                        return seeAllItem;
                      });

                      setSeeAll((prev) => {
                        if (
                          Object.values(
                            prev[item.id as keyof typeof prev] || {},
                          )[0] === false
                        )
                          setHeightFun();

                        return newSeeAllData;
                      });
                    }}
                    className={`${
                      data.filter((dataItem) => dataItem.item.type === item.id)
                        .length <= item.defItems
                        ? ' hidden'
                        : ''
                    }`}
                  >
                    {Object.values(
                      seeAll.find(
                        (tempItem) => Object.keys(tempItem)[0] === item.id,
                      ) || {},
                    )[0]
                      ? 'See Less'
                      : 'See All'}
                  </ClearButton>
                </div>
              </div>
              <div className="searchDropdownDataContainer">
                {data.filter((dataItem) => dataItem.item.type === item.id)
                  .length > 0 ? (
                  data
                    .filter((dataItem) => dataItem.item.type === item.id)
                    .slice(
                      0,
                      Object.values(
                        maxItems.find(
                          (tempItem) => Object.keys(tempItem)[0] === item.id,
                        ) || {},
                      )[0],
                    )
                    .map((dataItem) => {
                      return (
                        <button
                          type="button"
                          className="dropdownItem"
                          onClick={() => itemDropdownFunction(dataItem)}
                          key={`${dataItem.item.id}_${dataItem.item.name}`}
                        >
                          {dropdownItem(dataItem)}
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
          ))}
          {data.filter(
            (item) =>
              typeof item.item.recent !== 'undefined' && item.item.recent,
          ).length > 0 && (
            <div id="recent" className="searchSectionContainer">
              <div className="searchDropdownHeader">
                <div className="searchDropdownTitle">Recent</div>
              </div>
              <div className="searchDropdownDataContainer">
                {data
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
                        className="dropdownItem"
                        onClick={() => itemDropdownFunction(item)}
                        key={`${item.item.id}_${item.item.name}`}
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
    data,
    gridRef,
    setGridSearchText,
    setSearchText,
    setOpenSearch,
    seeAll,
    maxItems,
    openSearch,
    maxItemsTemp,
    visible,
  ]);

  const dataTooltipContent = React.useMemo(() => {
    return searchText === '' ? 'Close' : 'Clear Search';
  }, [searchText]);

  return (
    <Modal
      closeOnOutsideClick
      closeOnClickFn={() => {
        setOpenSearch(false);
      }}
      noCloseBtn
      className={`searchModal${
        seeAll.find((item) => Object.values(item)[0] === true) ? ' seeAll' : ''
      }`}
      wrapperClassName={openSearch && searchText.length > 2 ? ' visible' : ''}
      open={openSearch}
      setOpen={setOpenSearch}
    >
      <div
        className={`searchModalContainer${
          openSearch && searchText.length > 2 ? ' visibleDrop' : ''
        }`}
      >
        <div className="inputContainer">
          <div className="inputContent">
            <div className="searchIconContainer">
              <MemoSearch />
            </div>
            <input
              placeholder="Search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (typeof setGridSearchText !== 'undefined')
                  setGridSearchText('');
                if (gridRef) {
                  const api = gridRef.current?.api;
                  if (api) {
                    api.collapseAll();
                  }
                }
              }}
            />
            <IconButton
              containerProps={{
                className: 'clearIconContainer',
              }}
              data-tooltip-id="clearTooltip3"
              data-tooltip-content={dataTooltipContent}
              className="clearIconButton"
              icon={<MemoClear />}
              onClick={() => {
                setSeeAll(
                  dataTypes.map((item) => ({
                    [item.id]: false,
                  })),
                );
                setHeightFun();
                if (gridRef) {
                  const api = gridRef.current?.api;
                  if (api) {
                    api.collapseAll();
                  }
                }
                if (searchText === '') setOpenSearch(false);
                else {
                  setSearchText('');
                  if (typeof setGridSearchText !== 'undefined')
                    setGridSearchText('');
                }
              }}
            />
          </div>
        </div>
        {dropdownData}
      </div>
    </Modal>
  );
}
