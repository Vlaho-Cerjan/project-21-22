import type {AgGridReact} from 'ag-grid-react';
import type {FuseResult} from 'fuse.js';
import dynamic from 'next/dynamic';
import React from 'react';
import {setTimeout} from 'timers';
import {useWindowSize} from 'usehooks-ts';

import MemoClear from '@/src/icons/clear';
import MemoPlay from '@/src/icons/play';
import MemoPlayer from '@/src/icons/player';
import MemoSearch from '@/src/icons/search';
import ItemMatches from '@/src/utils/ItemMatcher';
import matchEl from '@/src/utils/MatchEl';

import ClearButton from '../common/button/clearButton';
import Description from '../common/description/description';
import IconButton from '../common/iconButton/iconButton';
import Title from '../common/title/title';
import type {fakeData} from '../dataGrid/fakeData';

const RcDropdownLazy = dynamic(() => import('rc-dropdown'), {ssr: false});

export default function DevicesFuzzySearch({
  openSearch,
  setOpenSearch,
  searchText,
  setSearchText,
  view,
  setGridSearchText,
  data,
  gridRef,
}: {
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  view: 'list' | 'map';
  setGridSearchText: React.Dispatch<React.SetStateAction<string>>;
  data: FuseResult<(typeof fakeData)[0]>[];
  gridRef: React.RefObject<AgGridReact<any>>;
}) {
  const {width} = useWindowSize();
  const [seeAll, setSeeAll] = React.useState({
    devices: false,
    media: false,
    users: false,
  });
  const [buttonOpenSearch, setButtonOpenSearch] = React.useState(false);
  const visible = React.useMemo(() => {
    return buttonOpenSearch && searchText.length > 2;
  }, [buttonOpenSearch, searchText]);

  const [initHeight, setInitHeight] = React.useState({
    devices: 0,
    media: 0,
    users: 0,
  });

  React.useEffect(() => {
    if (!openSearch) {
      setButtonOpenSearch(false);
    }
  }, [openSearch]);

  React.useEffect(() => {
    setTimeout(() => {
      const devices = document.getElementById('devices');
      const media = document.getElementById('media');
      const heights = {
        devices: 0,
        media: 0,
      };
      if (devices) {
        heights.devices = devices.clientHeight;
      }
      if (media) {
        heights.media = media.clientHeight;
      }

      setInitHeight((prev) => {
        return {
          ...prev,
          ...heights,
        };
      });
    }, 251);
  }, []);

  React.useEffect(() => {
    const devices = document.getElementById('devices');
    if (devices) {
      if (!seeAll.devices && initHeight.devices > 0) {
        setTimeout(() => {
          devices.setAttribute('style', `max-height: ${initHeight.devices}px;`);
        }, 1);
      } else {
        devices.removeAttribute('style');
      }
    }
  }, [initHeight.devices]);

  React.useEffect(() => {
    const media = document.getElementById('media');
    if (media) {
      if (!seeAll.media && initHeight.media > 0) {
        setTimeout(() => {
          media.setAttribute('style', `max-height: ${initHeight.devices}px;`);
        }, 1);
      } else {
        media.removeAttribute('style');
      }
    }
  }, [initHeight.media]);

  const [maxItems, setMaxItems] = React.useState({
    devices: 5,
    media: 2,
    users: 2,
  });

  React.useEffect(() => {
    if (seeAll.devices)
      setMaxItems((prev) => {
        return {
          ...prev,
          devices: data.length,
        };
      });
    else
      setTimeout(
        () =>
          setMaxItems((prev) => {
            return {
              ...prev,
              devices: 5,
            };
          }),
        250,
      );
  }, [seeAll.devices]);

  React.useEffect(() => {
    if (seeAll.media)
      setMaxItems((prev) => {
        return {
          ...prev,
          media: data.length,
        };
      });
    else
      setTimeout(
        () =>
          setMaxItems((prev) => {
            return {
              ...prev,
              media: 2,
            };
          }),
        250,
      );
  }, [seeAll.media]);

  const itemDropdownFunction = (item: FuseResult<(typeof fakeData)[0]>) => {
    setSearchText(item.item.deviceName);
    setGridSearchText(item.item.deviceName);
    const api = gridRef.current?.api;
    if (api) {
      api.expandAll();
    }

    setOpenSearch(false);
  };

  const dropdownData = React.useMemo(() => {
    const dropdownItem = (item: FuseResult<(typeof fakeData)[0]>) => {
      return (
        <>
          <div className="dropdownItemLeft">
            <div className="dropdownIcon">
              <MemoPlayer />
            </div>
            <div className="dropdownContent">
              <Title>
                {matchEl(
                  item.item.deviceName,
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
                  item.item.nowPlaying,
                  ItemMatches(item.matches || [], 'nowPlaying'),
                )}
              </span>
            </Description>
            <Description>
              <span>
                {matchEl(
                  item.item.tvCode,
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
        className={`searchDropdownContainer${seeAll.devices ? ' seeAll' : ''}${
          seeAll.media ? ' seeAll' : ''
        }${seeAll.users ? ' seeAll' : ''}`}
      >
        <div className="searchDropdownWrapper">
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
                  className={`resultCount${data.length <= 5 ? ' hidden' : ''}`}
                >
                  {data.length}
                </span>
              </div>
              <div className="searchDropdownButtonContainer">
                <ClearButton
                  onClick={() =>
                    setSeeAll((prev) => {
                      return {
                        ...prev,
                        devices: !prev.devices,
                      };
                    })
                  }
                  className={`${data.length <= 5 ? ' hidden' : ''}`}
                >
                  {seeAll.devices ? 'See Less' : 'See All'}
                </ClearButton>
              </div>
            </div>
            <div className="searchDropdownDataContainer">
              {data.slice(0, maxItems.devices).map((item) => {
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
                  className={`resultCount${data.length <= 2 ? ' hidden' : ''}`}
                >
                  {data.length}
                </span>
              </div>
              <div className="searchDropdownButtonContainer">
                <ClearButton
                  onClick={() =>
                    setSeeAll((prev) => {
                      return {
                        ...prev,
                        media: !prev.media,
                      };
                    })
                  }
                  className={`${data.length <= 2 ? ' hidden' : ''}`}
                >
                  {seeAll.media ? 'See Less' : 'See All'}
                </ClearButton>
              </div>
            </div>
            <div className="searchDropdownDataContainer">
              {data.slice(0, maxItems.media).map((item) => {
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
          {data
            .filter(
              (item) =>
                typeof item.item.recent !== 'undefined' && item.item.recent,
            )
            .slice(0, 2).length > 0 && (
            <div className="searchSectionContainer">
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
    gridRef,
    setGridSearchText,
    setSearchText,
    setOpenSearch,
    width,
    seeAll,
    maxItems,
  ]);
  return (
    <div className="searchInputWrapper">
      <div
        id="searchInputContainer"
        className={`searchInputContainer${openSearch ? ' open' : ''}${
          visible ? ' dropdownVisible' : ''
        }`}
      >
        <RcDropdownLazy
          align={{
            offset: [0, -4],
          }}
          overlayClassName="searchDropdown"
          overlay={dropdownData}
          visible={visible}
        >
          <div aria-hidden={!openSearch} className="inputContainer">
            <div id="rcContainer" className="inputContent">
              <IconButton
                data-tooltip-id={!openSearch ? 'searchTooltip' : undefined}
                data-tooltip-content="Search devices"
                containerProps={{
                  className: 'searchIconButton',
                }}
                disabled={view === 'map'}
                onClick={() => {
                  const input = document.querySelector(
                    '.searchInputContainer input',
                  );
                  setOpenSearch(true);
                  setTimeout(() => {
                    setButtonOpenSearch(true);
                    if (input && input instanceof HTMLInputElement)
                      input.focus();
                  }, 500);
                }}
                icon={<MemoSearch />}
              />
              <input
                placeholder="Search"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setGridSearchText('');
                  const api = gridRef.current?.api;
                  if (api) {
                    api.collapseAll();
                  }
                }}
              />
              <IconButton
                data-tooltip-id={!openSearch ? 'clearTooltip' : undefined}
                data-tooltip-content="Clear search"
                className="clearIconButton"
                icon={<MemoClear />}
                onClick={() => {
                  const api = gridRef.current?.api;
                  if (api) {
                    api.collapseAll();
                  }
                  if (searchText === '') setOpenSearch(false);
                  else {
                    setSearchText('');
                    setGridSearchText('');
                  }
                }}
              />
            </div>
          </div>
        </RcDropdownLazy>
        {
          <div
            className="mobileOverlay"
            onClick={() => {
              const input = document.querySelector(
                '#searchInputContainer input',
              );
              if (input && input instanceof HTMLInputElement)
                setOpenSearch(false);
            }}
          />
        }
      </div>
    </div>
  );
}
