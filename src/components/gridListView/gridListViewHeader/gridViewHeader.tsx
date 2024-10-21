import dynamic from 'next/dynamic';

import MemoClearDark from '@/src/icons/clear-dark';
import MemoDownArrow from '@/src/icons/down-arrow';
import MemoFilter from '@/src/icons/filter';
import MemoSort from '@/src/icons/sort';
import IsItMobile from '@/src/utils/IsItMobileDevice';
import type {Filter} from '@/types/filterData';
import React from 'react';
import ClearButton from '../../common/button/clearButton';
import Checkmark from '../../common/checkmark/checkmark';
import IconButton from '../../common/iconButton/iconButton';

const RcDropdownLazy = dynamic(() => import('rc-dropdown'), {ssr: false});

export default function GridViewHeader({
  setFolderSidebarOpen,
  filters,
  setFilters,
  onSort,
  sortKeys,
  selectedSortKey,
  direction,
  noTags,
}: {
  setFolderSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters?: Filter[];
  setFilters?: React.Dispatch<React.SetStateAction<Filter[]>>;
  onSort?: (key: string, direction: string) => void;
  sortKeys?: string[];
  selectedSortKey?: string;
  direction?: string;
  noTags?: boolean;
}) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<
    {
      filterId: string;
      id: string | number;
      name: string;
    }[]
  >([]);

  React.useEffect(() => {
    if (filters) {
      setSelectedFilters(
        filters
          .filter((f) => f.data.some((d) => d.checked))
          .map((f) => ({
            filterId: f.id,
            id: f.data.find((d) => d.checked)?.id || '',
            name: f.data.find((d) => d.checked)?.name || '',
          })),
      );
    }
  }, [filters]);

  const getSortedText = (sortText: string) => {
    if (sortText === 'created_at') return 'Date Created';
    if (sortText === 'updated_at') return 'Date Modified';
    if (sortText.includes('type_id'))
      return sortText.replace('type_id', 'Type').replaceAll('_', ' ');
    return sortText.replaceAll('_', ' ');
  };

  React.useEffect(() => {
    if (IsItMobile()) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    const handleResize = () => {
      if (IsItMobile()) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);

    const handleClickOutsideDropdown = (e: Event) => {
      if (
        e.target instanceof Element &&
        !e.target.closest('.filterDropdown') &&
        !e.target.closest('.filterButton') &&
        !e.target.classList.contains('filterButton')
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutsideDropdown);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutsideDropdown);
    };
  }, []);

  return (
    <div className="folderViewContentHeader">
      <div className="leftContainer">
        {filters &&
          filters.length > 0 &&
          (!isMobile ? (
            <RcDropdownLazy
              overlayClassName="filterDropdown"
              visible={isDropdownOpen}
              overlay={
                <div
                  data-testid="filterDesktopDropdown"
                  className="filterDropdownContent"
                >
                  {filters &&
                    filters.map((filter) => (
                      <div key={filter.id} className="filterDropdownItem">
                        <h4>{filter.name}</h4>
                        {filter.data.map((item) => (
                          <Checkmark
                            key={item.id}
                            value={item.checked}
                            type={filter.type}
                            setValue={(value) => {
                              if (setFilters) {
                                setFilters(
                                  // clear all other filters in the same group
                                  filters.map((f) => {
                                    if (f.type === 'radio') {
                                      if (f.name === filter.name) {
                                        return {
                                          ...f,
                                          data: f.data.map((i) => {
                                            if (i.name === item.name) {
                                              return {
                                                ...i,
                                                checked: value,
                                              };
                                            }
                                            return {
                                              ...i,
                                              checked: false,
                                            };
                                          }),
                                        };
                                      }
                                      return f;
                                    }
                                    if (f.name === filter.name) {
                                      return {
                                        ...f,
                                        data: f.data.map((i) => {
                                          if (i.name === item.name) {
                                            return {
                                              ...i,
                                              checked: value,
                                            };
                                          }
                                          return i;
                                        }),
                                      };
                                    }
                                    return f;
                                  }),
                                );
                                setIsDropdownOpen(false);
                              }
                            }}
                            name={item.name}
                            parentName={filter.name}
                            title={item.name}
                          />
                        ))}
                      </div>
                    ))}
                </div>
              }
            >
              <ClearButton
                className="filterButton"
                data-testid="filterButton"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="mobileFilterCounter">
                  {selectedFilters.length > 0 && (
                    <span data-testid="mobileFilterCounter">
                      {selectedFilters.length}
                    </span>
                  )}
                </div>
                <MemoFilter />
                <span>Filters</span>
              </ClearButton>
            </RcDropdownLazy>
          ) : (
            <ClearButton
              className="filterButton"
              data-testid="mobileFilterButton"
              onClick={() => setFolderSidebarOpen(true)}
            >
              <div className="mobileFilterCounter">
                {selectedFilters.length > 0 && (
                  <span data-testid="mobileFilterCounter">
                    {selectedFilters.length}
                  </span>
                )}
              </div>
              <MemoFilter />
              <span>Filters</span>
            </ClearButton>
          ))}
        {(typeof noTags === 'undefined' || !noTags) && (
          <div className="activeFiltersContainer">
            <div className="activeFilters" data-testid="activeFilters">
              {selectedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="activeFilter"
                  data-testid={`activeFilter_${filter.id}`}
                >
                  <span>{filter.name}</span>
                  <ClearButton
                    data-testid={`clearFilter_${filter.id}`}
                    onClick={() => {
                      if (setFilters) {
                        setFilters(
                          filters?.map((f) => {
                            if (f.id === filter.filterId) {
                              return {
                                ...f,
                                data: f.data.map((d) => ({
                                  ...d,
                                  checked: false,
                                })),
                              };
                            }
                            return f;
                          }) || [],
                        );
                      }
                    }}
                  >
                    <MemoClearDark />
                  </ClearButton>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="rightContainer">
        {sortKeys && sortKeys.length > 0 && (
          <>
            <IconButton
              data-testid="sortDirectionButton"
              onClick={() => {
                const dir = direction === 'asc' ? 'desc' : 'asc';
                if (typeof onSort !== 'undefined')
                  onSort(selectedSortKey || '', dir);
              }}
              className={`sortButtonOrder ${direction}`}
              data-tooltip-id="sortTooltip"
              data-tooltip-content={`Sort by ${
                direction === 'asc' ? 'Descending' : 'Ascending'
              } Order`}
              icon={<MemoSort />}
            />
            <RcDropdownLazy
              align={{
                offset: [-30, 4],
              }}
              overlayClassName="sortDropdown"
              trigger={['click']}
              overlay={
                <div className="sortDropdownContent">
                  {sortKeys &&
                    sortKeys.map((sort) => (
                      <button
                        data-testid={`sortKey_${sort}`}
                        key={`${sort}_id`}
                        onClick={() => {
                          if (sort === selectedSortKey) {
                            if (typeof onSort !== 'undefined')
                              onSort(
                                sort,
                                direction === 'asc' ? 'desc' : 'asc',
                              );
                          } else if (typeof onSort !== 'undefined')
                            onSort(sort, direction || '');
                        }}
                        type="button"
                        className="dropdownButton"
                      >
                        <span
                          className={sort === selectedSortKey ? 'active' : ''}
                        >
                          {getSortedText(sort)}
                        </span>
                      </button>
                    ))}
                </div>
              }
            >
              <ClearButton
                data-testid="openSortDropdownButton"
                className="sortButton"
              >
                <span>{getSortedText(selectedSortKey || '')}</span>
                <MemoDownArrow className="downIcon" />
              </ClearButton>
            </RcDropdownLazy>
          </>
        )}
      </div>
    </div>
  );
}
