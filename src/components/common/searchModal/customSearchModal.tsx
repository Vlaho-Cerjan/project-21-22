import {debounce, isArray} from 'lodash';
import Image from 'next/image';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import MemoClear from '@/src/icons/clear';
import MemoMediaText from '@/src/icons/media-text';
import MemoPlayer from '@/src/icons/player';
import MemoSearch from '@/src/icons/search';
import ItemMatches from '@/src/utils/ItemMatcher';
import matchEl from '@/src/utils/MatchEl';

import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {FormatDateWithTime} from '@/src/utils/FormatDate';
import type {Filter} from '@/types/filterData';
import type {FuseResult, IFuseOptions} from 'fuse.js';
import {fakeArea, fakeVenue} from '../../dataGrid/fakeData';
import ClearButton from '../button/clearButton';
import Description from '../description/description';
import IconButton from '../iconButton/iconButton';
import Modal from '../modal/modal';
import Title from '../title/title';

interface DisplayKeys {
  id: string[] | string;
  position: 'top left' | 'top right' | 'bottom right' | 'bottom left';
  separator?: string | '|';
}

export default function CustomSearchModal({
  openSearch,
  setOpenSearch,
  searchText,
  setSearchText,
  data,
  setData,
  dataTypes,
  displayKeys,
  setGridSearchText,
  onSearch,
  filters,
}: {
  onSearch: (searchText: string, filters: Filter[]) => Promise<any[]>;
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  dataTypes: {
    id: string;
    name: string;
    defItems: number;
  }[];
  displayKeys: DisplayKeys[];
  setGridSearchText?: React.Dispatch<React.SetStateAction<string>>;
  filters?: Filter[];
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

  const [itemMatches, setItemMatches] = React.useState<
    FuseResult<(typeof data)[0]>[]
  >([]);

  const debounceSearch = React.useCallback(
    debounce(async (searchTextData: string) => {
      console.log('searchTextData', searchTextData);
      const res = await onSearch(
        searchTextData,
        typeof filters !== 'undefined' ? filters : [],
      );
      setData(res || []);
    }, 1000),
    [JSON.stringify(filters)],
  );

  useDidUpdateEffect(() => {
    // debounce search
    if (searchText.length > 2) {
      debounceSearch(searchText);
    }
  }, [searchText]);

  const formatItem = (key: string, item: any) => {
    switch (key) {
      case 'size':
        if (item.size) {
          return item.size.toString().length > 3
            ? `${(item.size / 1000).toFixed(2)} MB`
            : `${item.size} KB`;
        }
        return 'No Data';
      case 'duration':
        if (item.duration) {
          return item.duration > 60
            ? `${Math.floor(item.duration / 60)}:${`0${
                item.duration % 60
              }`.slice(-2)} min`
            : `${item.duration} sec`;
        }
        return 'No Data';
      case 'created_at':
        if (item.created_at) {
          return FormatDateWithTime(new Date(item.created_at));
        }
        return 'No Data';
      case 'updated_at':
        if (item.updated_at) {
          return FormatDateWithTime(new Date(item.updated_at));
        }
        return 'No Data';
      default:
        return item[key] || 'No Data';
    }
  };

  const findItem = (keyItem: string, item: any) => {
    let matchItem = '';
    const matchItemValue = {
      value: '',
    };
    const keyElSplit = keyItem.split('.');
    keyElSplit.forEach((keyElSplitItem, index) => {
      if (index === 0) {
        matchItem = item[keyElSplitItem] || '';
        if (keyElSplitItem === 'area') {
          const areaData =
            fakeArea.find((area) => area.id === matchItem)?.name || '';
          if (areaData) {
            matchItemValue.value = areaData;
          }
        }
      } else if (isArray(matchItem) && matchItem.length > 0) {
        const matchItemTemp = {
          item: '',
        };
        matchItem.forEach((matchItemEl: any) => {
          if (matchItemEl[keyElSplitItem as any]) {
            matchItemTemp.item = matchItemEl[keyElSplitItem as any];
            if (keyElSplitItem === 'area') {
              const areaData =
                fakeArea.find((area) => area.id === matchItemTemp.item)?.name ||
                '';

              if (areaData) {
                matchItemValue.value = areaData;
              }
            }
            if (keyElSplitItem === 'venue') {
              const venueData =
                fakeVenue.find(
                  (venue) =>
                    venue.areaId === matchItemEl.area &&
                    venue.id === matchItemTemp.item,
                )?.name || '';
              if (venueData) {
                matchItemValue.value = venueData;
              }
            }
          }
        });
        if (matchItemTemp) matchItem = matchItemTemp.item;
      } else {
        matchItem = matchItem[keyElSplitItem as any] || '';
        if (keyElSplitItem === 'area') {
          const areaData =
            fakeArea.find((area) => area.id === matchItem)?.name || '';

          if (areaData) matchItemValue.value = areaData;
        }
      }
    });

    if (matchItemValue.value) {
      return matchItemValue.value;
    }

    return matchItem;
  };

  const formatDisplayKey = (key: DisplayKeys, item: any) => {
    const keyCopy = {...key};
    const formattedData = {
      item: '',
    };
    if (typeof keyCopy.id === 'string') {
      if (keyCopy.id.includes('.')) {
        formattedData.item = formatItem(findItem(keyCopy.id, item), item);
      }
      formattedData.item = formatItem(keyCopy.id, item);
    } else {
      const formattedItems = keyCopy.id.map((keyItem) => {
        return formatItem(keyItem, item);
      });
      formattedData.item = formattedItems.join(keyCopy.separator || ' | ');
    }

    if (keyCopy.position === 'top left') {
      return (
        <Title key={keyCopy.id as string}>
          {matchEl(
            formattedData.item,
            ItemMatches(
              itemMatches.find((itemMatchesEl) => itemMatchesEl.item === item)
                ?.matches || [],
              keyCopy.id,
            ),
          )}
        </Title>
      );
    }
    return (
      <Description key={keyCopy.id as string}>
        {matchEl(
          formattedData.item,
          ItemMatches(
            itemMatches.find((itemMatchesEl) => itemMatchesEl.item === item)
              ?.matches || [],
            keyCopy.id,
          ),
        )}
      </Description>
    );
  };

  const searchWithFuse = async (searchTextData: string) => {
    const Fuse = (await import('fuse.js')).default;
    const options: IFuseOptions<(typeof data)[0]> = {
      includeScore: true,
      ignoreLocation: true,
      isCaseSensitive: false,
      includeMatches: true,
      keys: [
        'name',
        'title',
        'address',
        'groupName',
        'type',
        'url',
        'status',
        'zip',
        'city',
        'email',
        'latitude',
        'address_1',
        'address_2',
        'last_name',
        'longitude',
        'first_name',
        'state_code',
        'business_type_id',
        'company_role',
        'country_code',
        'phone_number',
        'business_name',
        'phone',
        'created_at',
        'updated_at',
        'description',
      ],
    };
    const fuse = new Fuse(data, options);
    const res = fuse.search(searchTextData);
    return res;
  };

  React.useEffect(() => {
    const search = async () => {
      const res = await searchWithFuse(searchText);
      setItemMatches(res);
    };
    if (data.length > 0) search();
    else setItemMatches([]);
  }, [data]);

  // set random string uuid
  const randomId = React.useMemo(() => {
    return Math.random().toString(36).substring(7);
  }, []);

  useDidUpdateEffect(() => {
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
            [max]:
              dataTypes.length === 1
                ? data.length
                : data.filter((dataItem) => dataItem.type === seeAllId).length,
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
        const dataItem = document.getElementById(
          `searchSectionContainer_${max}`,
        );
        const dataLength =
          dataTypes.length === 1
            ? data.length
            : data.filter((dataItemTemp) => dataItemTemp.type === max).length;
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
    const mainContainer = document.getElementById(
      `listFuzzySearch_${randomId}`,
    );
    maxItemsTemp.forEach((item) => {
      const max = Object.keys(item)[0];
      if (max) {
        const dataItem = document.getElementById(
          `searchSectionContainer_${max}`,
        );
        const otherElements: NodeListOf<HTMLElement> =
          document.querySelectorAll(
            `.searchSectionContainer:not(#searchSectionContainer_${max})`,
          );
        const dataLength =
          dataTypes.length === 1
            ? data.length
            : data.filter((dataItemTemp) => dataItemTemp.type === max).length;
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
    const mainContainer = document.getElementById(
      `listFuzzySearch_${randomId}`,
    );
    const recent = document.getElementById('recent');
    const fuzzyDataHeightRecent =
      data
        .filter((item) => typeof item.recent !== 'undefined' && item.recent)
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
          const dataItem = document.getElementById(
            `searchSectionContainer_${max}`,
          );
          const dataLength =
            dataTypes.length === 1
              ? data.length
              : data.filter((dataItemTemp) => dataItemTemp.type === max).length;
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
    const mainContainer = document.getElementById(
      `listFuzzySearch_${randomId}`,
    );
    mainContainer?.removeAttribute('style');
  }, [height]);

  React.useEffect(() => {
    const searchDropdownContainer = document.getElementById(
      `listFuzzySearch_${randomId}`,
    );
    if (Object.values(seeAll).find((item) => Object.values(item)[0] === true)) {
      searchDropdownContainer?.classList.add('seeAll');
    } else {
      searchDropdownContainer?.classList.remove('seeAll');
    }
  }, [seeAll]);

  const itemDropdownFunction = (item: any) => {
    setSearchText(
      item.business_name ||
        item.name ||
        (item.first_name && `${item.first_name} ${item.last_name}`) ||
        item.title ||
        '',
    );
    if (typeof setGridSearchText !== 'undefined')
      setGridSearchText(
        item.business_name ||
          item.name ||
          (item.first_name && `${item.first_name} ${item.last_name}`) ||
          item.title ||
          '',
      );
    setOpenSearch(false);
  };

  const dropdownData = React.useMemo(() => {
    const dropdownItem = (item: any) => {
      return (
        <>
          <div className="dropdownItemLeft">
            {typeof item.type !== 'undefined' && (
              <div className="dropdownIcon">
                {item.type === 'image' && (
                  <Image
                    src={item.url || ''}
                    alt={item.name}
                    // 16/9 aspect
                    height={32}
                    width={57}
                  />
                )}
                {item.type === 'video' && (
                  <Image
                    src={item.thumb || item.url || ''}
                    alt={item.name}
                    // 16/9 aspect
                    height={32}
                    width={57}
                  />
                )}
                {item.type === 'text' && (
                  <MemoMediaText
                    style={{
                      height: '32px',
                      width: '57px',
                    }}
                  />
                )}
                {item.type !== 'image' &&
                  item.type !== 'video' &&
                  item.type !== 'text' && <MemoPlayer />}
              </div>
            )}
            <div className="dropdownContent">
              {displayKeys
                .filter((key) => key.position.includes('left'))
                .map((keyItem) => {
                  return formatDisplayKey(keyItem, item);
                })}
            </div>
          </div>
          <div className="dropdownItemRight">
            {displayKeys
              .filter((key) => key.position.includes('right'))
              .map((keyItem) => {
                return formatDisplayKey(keyItem, item);
              })}
          </div>
        </>
      );
    };
    return (
      <div
        id={`listFuzzySearch_${randomId}`}
        className={`searchDropdownContainer${
          openSearch &&
          ((data && data.filter((tempItem) => tempItem.recent).length > 1) ||
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
          {data &&
            dataTypes.map((item) => (
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
                        dataTypes.length === 1 && data.length <= item.defItems
                          ? ' hidden'
                          : ''
                      }${
                        dataTypes.length > 1 &&
                        data.filter((dataItem) => dataItem.type === item.id)
                          .length <= item.defItems
                          ? ' hidden'
                          : ''
                      }`}
                    >
                      {dataTypes.length === 1
                        ? data.length
                        : data.filter((dataItem) => dataItem.type === item.id)
                            .length}
                    </span>
                  </div>
                  <div className="searchDropdownButtonContainer">
                    <ClearButton
                      data-testid="seeAllButton"
                      onClick={() => {
                        const mainContainer = document.getElementById(
                          `listFuzzySearch_${randomId}`,
                        );
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
                        dataTypes.length === 1 && data.length <= item.defItems
                          ? ' hidden'
                          : ''
                      }${
                        dataTypes.length > 1 &&
                        data.filter((dataItem) => dataItem.type === item.id)
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
                  {dataTypes.length === 1 &&
                    data
                      .slice(0, Object.values(maxItems[0] || {})[0])
                      .map((dataItem) => {
                        return (
                          <button
                            data-testid={`dropdownItem_${dataItem.id}`}
                            type="button"
                            className="dropdownItem"
                            onClick={() => itemDropdownFunction(dataItem)}
                            key={`${dataItem.id}_${dataItem.name}`}
                          >
                            {dropdownItem(dataItem)}
                          </button>
                        );
                      })}
                  {dataTypes.length > 1 &&
                  data.filter((dataItem) => dataItem.type === item.id).length >
                    0 ? (
                    data
                      .filter((dataItem) => dataItem.type === item.id)
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
                            data-testid={`dropdownItem_${dataItem.id}`}
                            type="button"
                            className="dropdownItem"
                            onClick={() => itemDropdownFunction(dataItem)}
                            key={`${dataItem.id}_${dataItem.name}`}
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
          {data &&
            data.filter(
              (item) => typeof item.recent !== 'undefined' && item.recent,
            ).length > 0 && (
              <div id="recent" className="searchSectionContainer">
                <div className="searchDropdownHeader">
                  <div className="searchDropdownTitle">Recent</div>
                </div>
                <div className="searchDropdownDataContainer">
                  {data
                    .filter(
                      (item) =>
                        typeof item.recent !== 'undefined' && item.recent,
                    )
                    .slice(0, 2)
                    .map((item) => {
                      return (
                        <button
                          data-testid={`dropdownItemRecent_${item.id}`}
                          type="button"
                          className="dropdownItem"
                          onClick={() => itemDropdownFunction(item)}
                          key={`${item.id}_${item.name}`}
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
    itemMatches,
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
        setTimeout(async () => {
          setOpenSearch(false);
          setSearchText('');
          setData([]);
        }, 250);
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
              data-testid="searchModalInput"
              placeholder="Search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
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
              onClick={async () => {
                setSeeAll(
                  dataTypes.map((item) => ({
                    [item.id]: false,
                  })),
                );
                setHeightFun();
                setData([]);
                if (searchText === '') {
                  setOpenSearch(false);
                } else {
                  setSearchText('');
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
