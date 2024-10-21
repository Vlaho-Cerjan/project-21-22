import type {FuseResult} from 'fuse.js';
import React from 'react';

import type {BackendVideoData} from '@/src/constants/backendData';
import {backendVideosData} from '@/src/constants/backendData';
import MemoCheckmark from '@/src/icons/checkmark';
import MemoClear from '@/src/icons/clear';
import MemoFilter from '@/src/icons/filter';

import {ModalDivider} from '../../common/divider/divider';
import IconButton from '../../common/iconButton/iconButton';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import Sidebar from '../../common/sidebar/sidebar';
import SidebarContent from '../../common/sidebar/sidebarContent';
import SidebarFooter from '../../common/sidebar/sidebarFooter';
import SidebarHeader from '../../common/sidebar/sidebarHeader';
import type {Filters} from './filterResultsSidebar';
import FilterResultSidebar from './filterResultsSidebar';
import SearchResult from './searchResult';

export default function AddVideoSidebar({
  id,
  className,
  selectedVideos,
  open,
  setOpen,
  onSubmit,
}: {
  id: string;
  className: string;
  selectedVideos: BackendVideoData[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {videos: BackendVideoData[]}) => void;
}) {
  const [videos, setVideos] = React.useState<BackendVideoData[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [error, setError] = React.useState(false);
  const [backendVideosState, setBackendVideosState] =
    React.useState(backendVideosData);
  const [searchResults, setSearchResults] = React.useState<
    FuseResult<BackendVideoData>[]
  >(
    backendVideosState.map((tempVideos, index) => {
      return {
        item: tempVideos,
        score: 0,
        matches: [],
        refIndex: index,
      };
    }),
  );
  const [openFilterResultSidebar, setOpenFilterResultSidebar] =
    React.useState(false);
  const [filters, setFilters] = React.useState<Filters[]>([
    {
      id: 'ratings',
      name: 'Ratings',
      data: [
        {
          id: 'tv-g',
          name: 'TV-G',
          checked: false,
        },
        {
          id: 'tv-pg',
          name: 'TV-PG',
          checked: false,
        },
        {
          id: 'tv-14',
          name: 'TV-14',
          checked: false,
        },
        {
          id: 'tv-ma',
          name: 'TV-MA',
          checked: false,
        },
      ],
    },
    {
      id: 'genres',
      name: 'Genres',
      data: [
        {
          id: 'pop',
          name: 'Pop',
          checked: false,
        },
        {
          id: 'rock',
          name: 'Rock',
          checked: false,
        },
        {
          id: 'hip-hop',
          name: 'Hip-Hop',
          checked: false,
        },
        {
          id: 'country',
          name: 'Country',
          checked: false,
        },
        {
          id: 'jazz',
          name: 'Jazz',
          checked: false,
        },
        {
          id: 'classical',
          name: 'Classical',
          checked: false,
        },
        {
          id: 'metal',
          name: 'Metal',
          checked: false,
        },
        {
          id: 'electronic',
          name: 'Electronic',
          checked: false,
        },
        {
          id: 'folk',
          name: 'Folk',
          checked: false,
        },
        {
          id: 'indie',
          name: 'Indie',
          checked: false,
        },
        {
          id: 'rnb',
          name: 'R&B',
          checked: false,
        },
        {
          id: 'reggae',
          name: 'Reggae',
          checked: false,
        },
        {
          id: 'blues',
          name: 'Blues',
          checked: false,
        },
        {
          id: 'punk',
          name: 'Punk',
          checked: false,
        },
        {
          id: 'disco',
          name: 'Disco',
          checked: false,
        },
        {
          id: 'funk',
          name: 'Funk',
          checked: false,
        },
        {
          id: 'soul',
          name: 'Soul',
          checked: false,
        },
        {
          id: 'techno',
          name: 'Techno',
          checked: false,
        },
        {
          id: 'house',
          name: 'House',
          checked: false,
        },
        {
          id: 'k-pop',
          name: 'K-Pop',
          checked: false,
        },
        {
          id: 'j-pop',
          name: 'J-Pop',
          checked: false,
        },
        {
          id: 'latin',
          name: 'Latin',
          checked: false,
        },
        {
          id: 'reggaeton',
          name: 'Reggaeton',
          checked: false,
        },
        {
          id: 'ska',
          name: 'Ska',
          checked: false,
        },
        {
          id: 'punk-rock',
          name: 'Punk Rock',
          checked: false,
        },
        {
          id: 'alternative-rock',
          name: 'Alternative Rock',
          checked: false,
        },
      ],
    },
  ]);

  const filterCount = React.useMemo(() => {
    return filters
      .map((filter) => filter.data.filter((data) => data.checked))
      .flat().length;
  }, [filters]);

  React.useEffect(() => {
    const tempVideos: {
      videos: BackendVideoData[];
    } = {
      videos: [],
    };
    if (filters.some((filter) => filter.data.some((data) => data.checked))) {
      filters
        .find((filter) => filter.id === 'ratings')
        ?.data.forEach((data) => {
          if (data.checked) {
            tempVideos.videos.push(
              ...backendVideosData.filter(
                (video) =>
                  video.rating.toLowerCase() === data.name.toLowerCase(),
              ),
            );
          }
        });

      if (
        tempVideos.videos.length !== 0 &&
        filters
          .find((filter) => filter.id === 'genres')
          ?.data.some((data) => data.checked)
      ) {
        const filteredGenres: BackendVideoData[] = [];
        filters
          .find((filter) => filter.id === 'genres')
          ?.data.forEach((data) => {
            if (data.checked) {
              filteredGenres.push(
                ...tempVideos.videos.filter(
                  (video) =>
                    video.genre.toLowerCase() === data.id.toLowerCase(),
                ),
              );
            }
          });
        tempVideos.videos = filteredGenres;
      } else if (
        !filters
          .find((filter) => filter.id === 'ratings')
          ?.data.some((data) => data.checked)
      ) {
        filters
          .find((filter) => filter.id === 'genres')
          ?.data.forEach((data) => {
            if (data.checked) {
              tempVideos.videos.push(
                ...backendVideosData.filter(
                  (video) =>
                    video.genre.toLowerCase() === data.id.toLowerCase(),
                ),
              );
            }
          });
      }
      setBackendVideosState(tempVideos.videos);
    } else {
      setBackendVideosState(backendVideosData);
    }
  }, [filters]);

  React.useEffect(() => {
    setVideos(selectedVideos);
  }, [selectedVideos]);

  React.useEffect(() => {
    const handleSearch = async () => {
      const options = {
        includeScore: true,
        includeMatches: true,
        keys: ['name', 'artist'],
      };
      const Fuse = (await import('fuse.js')).default;
      const fuse = new Fuse(backendVideosState, options);
      if (searchText !== '')
        setSearchResults(fuse.search(searchText).map((item) => item));
      else
        setSearchResults(
          backendVideosState.map((tempVideos, index) => {
            return {
              item: tempVideos,
              score: 0,
              matches: [],
              refIndex: index,
            };
          }),
        );
    };
    handleSearch();
  }, [searchText, backendVideosState]);

  React.useEffect(() => {
    if (!open) {
      setSearchText('');
      setSearchResults(
        backendVideosState.map((tempVideos, index) => {
          return {
            item: tempVideos,
            score: 0,
            matches: [],
            refIndex: index,
          };
        }),
      );
      setError(false);
    }
  }, [open]);

  React.useEffect(() => {
    const setFilterDisplayHeight = () => {
      const filterDisplayContainer = document.getElementById(
        'filterDisplayContainer',
      );
      const activeFilters =
        filterDisplayContainer?.querySelector('.activeFilters');
      if (filterDisplayContainer && activeFilters && filterCount !== 0) {
        const prevHeight = filterDisplayContainer.style.height;
        filterDisplayContainer.style.height = `auto`;
        const displayScrollHeight = filterDisplayContainer.scrollHeight;
        filterDisplayContainer.style.height = prevHeight;
        const containerWidth = activeFilters.clientWidth;
        const childrenTotalWidth = Array.from(activeFilters.children).reduce(
          (acc, curr) => acc + curr.clientWidth + 4,
          0,
        );
        const filterDisplayContainerHeight = Math.ceil(
          childrenTotalWidth / containerWidth,
        );
        const totalHeight =
          filterDisplayContainerHeight * 26 < displayScrollHeight
            ? displayScrollHeight
            : filterDisplayContainerHeight * 22 +
              (filterDisplayContainerHeight - 1) * 4;
        filterDisplayContainer.style.height = `${totalHeight}px`;
      } else if (filterDisplayContainer && filterCount === 0) {
        filterDisplayContainer.style.height = `0`;
      }
    };

    setFilterDisplayHeight();
  }, [filterCount]);

  return (
    <div>
      <Sidebar
        className="addVideoSidebarContainer"
        sidebarClasses={`addVideoSidebar${id} ${className}`}
        sidebarOpen={open}
        setSidebarOpen={setOpen}
      >
        <SidebarHeader
          title="Add Video"
          description="Search by track or artist name"
        />
        <SidebarContent>
          <div className="dataContainer autoHeight">
            <ModalInputLabel
              onClear={() => setSearchText('')}
              labelText="Search Videos"
              inputProps={{
                value: searchText,
                onChange: (e) => {
                  setSearchText(e.currentTarget.value);
                },
                placeholder: 'Track or Artist Name',
              }}
            />
          </div>
          <ModalDivider />
          <div className="dataContainer searchDataContainer">
            <div className="searchDataContainerHeader">
              <label
                className="label"
                htmlFor="searchResults"
                title={`Showing ${searchResults.length} results`}
              >
                {`Showing ${searchResults.length || ''} results`}
              </label>
              <div className="filterIconContainer">
                <IconButton
                  onClick={() => setOpenFilterResultSidebar(true)}
                  data-tooltip-id="filterSearchResults"
                  data-tooltip-content="Filter Search Results"
                  icon={<MemoFilter />}
                />
                <div
                  className={`filterCount${filterCount === 0 ? ' hidden' : ''}`}
                >
                  {filterCount}
                </div>
              </div>
            </div>
            <div
              id="filterDisplayContainer"
              className={`displayContainer filterDisplayContainer${
                filterCount === 0 ? ' hidden' : ''
              }`}
            >
              <div className="activeItems activeFilters">
                {filters
                  .map((filter) => filter.data.filter((data) => data.checked))
                  .flat()
                  .map((data) => (
                    <button
                      type="button"
                      onClick={() => {
                        setFilters((prevFilters) =>
                          prevFilters.map((prevFilter) => {
                            return {
                              ...prevFilter,
                              data: prevFilter.data.map((prevData) =>
                                prevData.id === data.id
                                  ? {
                                      ...prevData,
                                      checked: false,
                                    }
                                  : prevData,
                              ),
                            };
                          }),
                        );
                      }}
                      key={data.id}
                      className="activeItem activeFilter"
                    >
                      {data.name}
                      <MemoClear />
                    </button>
                  ))}
              </div>
              <div className="clearFilters">
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prevFilters) =>
                      prevFilters.map((prevFilter) => {
                        return {
                          ...prevFilter,
                          data: prevFilter.data.map((prevData) => ({
                            ...prevData,
                            checked: false,
                          })),
                        };
                      }),
                    );
                  }}
                  className="activeItem clearFiltersButton"
                >
                  Clear All
                  <MemoClear />
                </button>
              </div>
            </div>
            <div
              style={
                {
                  '--result-count': `${searchResults.length}`,
                } as React.CSSProperties
              }
              className="searchResultsContainer"
            >
              <div className="searchResults">
                {searchResults.map((video) => (
                  <SearchResult
                    key={video.item.id}
                    selected={videos.some(
                      (selectedVideo) => selectedVideo.id === video.item.id,
                    )}
                    video={video.item}
                    videoAction={(tempVideo, selected) => {
                      if (selected) {
                        setVideos((prevVideos) =>
                          prevVideos.filter(
                            (prevVideo) => prevVideo.id !== tempVideo.id,
                          ),
                        );
                      } else {
                        setVideos((prevVideos) => [...prevVideos, tempVideo]);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </SidebarContent>
        <ModalDivider />
        <SidebarFooter
          setOpen={setOpen}
          isError={error}
          setIsError={setError}
          sidebarClass={`addVideoSidebar${id}`}
          buttonText="Add Videos"
          buttonIcon={<MemoCheckmark />}
          successText="Videos added successfully"
          onSubmit={() => {
            setOpen(false);
            onSubmit({
              videos,
            });
            return Promise.resolve('success');
          }}
        />
      </Sidebar>
      <FilterResultSidebar
        open={openFilterResultSidebar}
        setOpen={setOpenFilterResultSidebar}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}
