import type {FuseResult} from 'fuse.js';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import MemoClear from '@/src/icons/clear';
import MemoPlay from '@/src/icons/play';
import MemoPlayer from '@/src/icons/player';
import MemoSearch from '@/src/icons/search';
import ItemMatches from '@/src/utils/ItemMatcher';
import matchEl from '@/src/utils/MatchEl';

import type {FakeDataWithAreaVenue} from '../../networkView/network';
import ClearButton from '../button/clearButton';
import Description from '../description/description';
import IconButton from '../iconButton/iconButton';
import Modal from '../modal/modal';
import Title from '../title/title';

export default function SearchModal({
  openSearch,
  setOpenSearch,
  searchText,
  setSearchText,
  data,
}: {
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  data: FuseResult<FakeDataWithAreaVenue>[];
}) {
  const [seeAll, setSeeAll] = React.useState({
    devices: false,
    media: false,
    users: false,
  });

  const [maxItems, setMaxItems] = React.useState({
    devices: 5,
    media: 2,
    users: 2,
  });

  const [maxItemsTemp, setMaxItemsTemp] = React.useState({
    devices: 5,
    media: 2,
    users: 2,
  });

  // const transitionHeightRatio = 1.68;

  const {height} = useWindowSize();

  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (searchText.length > 2) setTimeout(() => setVisible(true), 250);
    else setVisible(false);
  }, [searchText]);

  React.useEffect(() => {
    if (!openSearch)
      setSeeAll({
        devices: false,
        media: false,
        users: false,
      });
  }, [openSearch]);

  React.useEffect(() => {
    if (seeAll.devices) {
      setMaxItems((prev) => {
        return {
          ...prev,
          devices: data.length,
        };
      });
      setMaxItemsTemp((prev) => {
        return {
          ...prev,
          devices: data.length,
        };
      });
    } else {
      setMaxItemsTemp((prev) => {
        return {
          ...prev,
          devices: 5,
        };
      });
      setTimeout(() => {
        setMaxItems((prev) => {
          return {
            ...prev,
            devices: 5,
          };
        });
      }, 250);
    }
  }, [seeAll.devices]);

  React.useEffect(() => {
    if (seeAll.media) {
      setMaxItems((prev) => {
        return {
          ...prev,
          media: data.length,
        };
      });
      setMaxItemsTemp((prev) => {
        return {
          ...prev,
          media: data.length,
        };
      });
    } else {
      setMaxItemsTemp((prev) => {
        return {
          ...prev,
          media: 2,
        };
      });
      setTimeout(() => {
        setMaxItems((prev) => {
          return {
            ...prev,
            media: 2,
          };
        });
      }, 250);
    }
  }, [seeAll.media]);

  React.useEffect(() => {
    if (seeAll.users) {
      setMaxItems((prev) => {
        return {
          ...prev,
          users: data.length,
        };
      });
      setMaxItemsTemp((prev) => {
        return {
          ...prev,
          users: data.length,
        };
      });
    } else {
      setMaxItemsTemp((prev) => {
        return {
          ...prev,
          users: 2,
        };
      });
      setTimeout(() => {
        setMaxItems((prev) => {
          return {
            ...prev,
            users: 2,
          };
        });
      }, 250);
    }
  }, [seeAll.users]);

  React.useEffect(() => {
    ['devices', 'media', 'recent'].forEach((item) => {
      const max = item;
      if (seeAll) {
        return;
      }

      if (max) {
        const dataItem = document.getElementById(max);
        const dataLength = data.filter(
          (dataItemTemp) => dataItemTemp.item.deviceName,
        ).length;
        const heightData =
          dataLength < (maxItems[max as 'devices' | 'media'] || 1)
            ? dataLength
            : maxItems[max as 'devices' | 'media'];
        const fuzzyDataHeight = (heightData || 1) * 50 - 10 + 29;
        const bodyHeight = document.body.clientHeight - 72;
        if (dataItem) {
          if (fuzzyDataHeight + 28 < bodyHeight) {
            dataItem.setAttribute('style', `height: ${fuzzyDataHeight + 28}px`);
          } else {
            dataItem.setAttribute('style', `height: ${bodyHeight}px`);
          }
        }
      }
    });
  }, [data]);

  React.useEffect(() => {
    const mainContainer = document.getElementById('listFuzzySearch');
    const devices = document.getElementById('devices');
    const media = document.getElementById('media');
    const recent = document.getElementById('recent');
    const fuzzyDataHeightDevices = maxItemsTemp.devices * 50 - 10 + 29;
    const bodyHeight = window.innerHeight - 72;
    if (devices && visible) {
      if (seeAll.devices) {
        media?.setAttribute('style', 'height: 0px');
        recent?.setAttribute('style', 'height: 0px');
        if (fuzzyDataHeightDevices + 28 < bodyHeight) {
          mainContainer?.setAttribute(
            'style',
            `height: ${fuzzyDataHeightDevices + 28}px; overflow: hidden`,
          );
          devices.setAttribute(
            'style',
            `height: ${fuzzyDataHeightDevices + 28}px`,
          );
        } else {
          mainContainer?.setAttribute('style', `height: ${bodyHeight}px`);
          devices.setAttribute('style', `height: ${bodyHeight}px`);
        }
        setTimeout(() => {
          devices.setAttribute('style', `height: ${fuzzyDataHeightDevices}px`);
        }, 250);
      }
    }
  }, [maxItemsTemp.devices]);

  React.useEffect(() => {
    const mainContainer = document.getElementById('listFuzzySearch');
    const devices = document.getElementById('devices');
    const media = document.getElementById('media');
    const recent = document.getElementById('recent');
    const fuzzyDataHeightMedia = maxItemsTemp.media * 50 - 10 + 29;
    const bodyHeight = window.innerHeight - 72;
    if (media && visible) {
      if (seeAll.media) {
        devices?.setAttribute('style', 'height: 0px');
        recent?.setAttribute('style', 'height: 0px');
        if (fuzzyDataHeightMedia + 28 < bodyHeight) {
          mainContainer?.setAttribute(
            'style',
            `height: ${fuzzyDataHeightMedia + 28}px; overflow: hidden`,
          );
          media.setAttribute('style', `height: ${fuzzyDataHeightMedia + 28}px`);
        } else {
          mainContainer?.setAttribute('style', `height: ${bodyHeight}px`);
          media.setAttribute('style', `height: ${bodyHeight}px`);
        }
        setTimeout(() => {
          media.setAttribute('style', `height: ${fuzzyDataHeightMedia}px`);
        }, 250);
      }
    }
  }, [maxItemsTemp.media]);

  const setHeightFun = () => {
    const mainContainer = document.getElementById('listFuzzySearch');
    const devices = document.getElementById('devices');
    const media = document.getElementById('media');
    const recent = document.getElementById('recent');
    const fuzzyDataHeightDevices = maxItemsTemp.devices * 50 - 10 + 29;
    const fuzzyDataHeightMedia = maxItemsTemp.media * 50 - 10 + 29;
    const fuzzyDataHeightRecent =
      data
        .filter(
          (item) => typeof item.item.recent !== 'undefined' && item.item.recent,
        )
        .slice(0, 2).length *
        50 -
      10 +
      29;
    if (Object.values(seeAll).filter((item) => item === true).length === 0) {
      mainContainer?.removeAttribute('style');
      media?.setAttribute('style', `height: ${fuzzyDataHeightMedia}px`);
      devices?.setAttribute('style', `height: ${fuzzyDataHeightDevices}px`);
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
    if (Object.values(seeAll).includes(true)) {
      searchDropdownContainer?.classList.add('seeAll');
    } else {
      searchDropdownContainer?.classList.remove('seeAll');
    }
  }, [seeAll]);

  const itemDropdownFunction = (item: FuseResult<FakeDataWithAreaVenue>) => {
    setSearchText(item.item.deviceName || '');

    setOpenSearch(false);
  };

  const dropdownData = React.useMemo(() => {
    const dropdownItem = (item: FuseResult<FakeDataWithAreaVenue>) => {
      return (
        <>
          <div className="dropdownItemLeft">
            <div className="dropdownIcon">
              <MemoPlayer />
            </div>
            <div className="dropdownContent">
              <Title>
                {matchEl(
                  item.item.deviceName || '',
                  ItemMatches(item.matches || [], 'deviceName'),
                )}
              </Title>
              <Description>
                <span>
                  {matchEl(
                    item.item.area,
                    ItemMatches(item.matches || [], 'area'),
                  )}
                  {` / `}
                  {matchEl(
                    item.item.venue || '',
                    ItemMatches(item.matches || [], 'venue'),
                  )}
                </span>
              </Description>
            </div>
          </div>
          <div className="dropdownItemRight">
            <Description>
              <MemoPlay />
              <span>
                {matchEl(
                  item.item.nowPlaying || '',
                  ItemMatches(item.matches || [], 'nowPlaying'),
                )}
              </span>
            </Description>
            <Description>
              <span>
                {matchEl(
                  item.item.tvCode || '',
                  ItemMatches(item.matches || [], 'tvCode'),
                )}
              </span>
            </Description>
          </div>
        </>
      );
    };
    return (
      <div
        id="listFuzzySearch"
        className={`searchDropdownContainer${openSearch ? ' visible' : ''}${
          seeAll.devices ? ' seeAll devices' : ''
        }${seeAll.media ? ' seeAll media' : ''}${
          seeAll.users ? ' seeAll users' : ''
        }`}
      >
        <div className="searchDropdownWrapper">
          {searchText.length > 2 && (
            <>
              <div
                id="devices"
                className={`searchSectionContainer${
                  seeAll.devices ? ' visible' : ''
                }`}
              >
                <div className="searchDropdownHeader">
                  <div className="searchDropdownTitle">
                    Devices
                    <span
                      className={`resultCount${
                        data.length <= 5 ? ' hidden' : ''
                      }`}
                    >
                      {data.length}
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
                            `height: ${mainContainer.clientHeight}px}`,
                          );
                        }
                        setSeeAll((prev) => {
                          if (prev.devices === false) setHeightFun();
                          return {
                            ...prev,
                            devices: !prev.devices,
                          };
                        });
                      }}
                      className={`${data.length <= 5 ? ' hidden' : ''}`}
                    >
                      {seeAll.devices ? 'See Less' : 'See All'}
                    </ClearButton>
                  </div>
                </div>
                <div className="searchDropdownDataContainer">
                  {data.length > 0 ? (
                    data.slice(0, maxItems.devices).map((item) => {
                      return (
                        <button
                          type="button"
                          className="dropdownItem"
                          onClick={() => itemDropdownFunction(item)}
                          key={`${item.item.id}_${item.item.deviceName}`}
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
              <div
                id="media"
                className={`searchSectionContainer${
                  seeAll.media ? ' visible' : ''
                }`}
              >
                <div className="searchDropdownHeader">
                  <div className="searchDropdownTitle">
                    Media Assets
                    <span
                      className={`resultCount${
                        data.length <= 2 ? ' hidden' : ''
                      }`}
                    >
                      {data.length}
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
                            `height: ${mainContainer.clientHeight}px}`,
                          );
                        }
                        setSeeAll((prev) => {
                          if (prev.media === false) setHeightFun();
                          return {
                            ...prev,
                            media: !prev.media,
                          };
                        });
                      }}
                      className={`${data.length <= 2 ? ' hidden' : ''}`}
                    >
                      {seeAll.media ? 'See Less' : 'See All'}
                    </ClearButton>
                  </div>
                </div>
                <div className="searchDropdownDataContainer">
                  {data.length > 0 ? (
                    data.slice(0, maxItems.media).map((item) => {
                      return (
                        <button
                          type="button"
                          className="dropdownItem"
                          onClick={() => itemDropdownFunction(item)}
                          key={`${item.item.id}_${item.item.deviceName}`}
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
            </>
          )}
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
                        key={`${item.item.id}_${item.item.deviceName}`}
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
        if (searchText === '') {
          setTimeout(() => {
            setOpenSearch(false);
          }, 250);
        }
      }}
      noCloseBtn
      wrapperClassName={openSearch && searchText.length > 2 ? ' visible' : ''}
      className={`searchModal${seeAll.devices ? ' seeAll devices' : ''}${
        seeAll.media ? ' seeAll media' : ''
      }${seeAll.users ? ' seeAll users' : ''}`}
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
              onClick={() => {
                setSeeAll({
                  devices: false,
                  media: false,
                  users: false,
                });
                setHeightFun();
                if (searchText === '') setOpenSearch(false);
                else {
                  setSearchText('');
                }
              }}
            />
            ;
          </div>
        </div>
        {dropdownData}
      </div>
    </Modal>
  );
}
