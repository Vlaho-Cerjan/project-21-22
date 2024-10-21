import ClearButton from '@/src/components/common/button/clearButton';
import MemoBack from '@/src/icons/back';
import MemoCheckmark from '@/src/icons/checkmark';

import type {Filter} from '@/types/filterData';
import Button from '../common/button/button';
import Checkmark from '../common/checkmark/checkmark';
import Sidebar from '../common/sidebar/sidebar';
import SidebarContent from '../common/sidebar/sidebarContent';
import {SidebarFooterContainer} from '../common/sidebar/sidebarFooter';
import SidebarHeader from '../common/sidebar/sidebarHeader';
import Title from '../common/title/title';

export default function FolderFilterSidebar({
  open,
  setOpen,
  filters,
  setFilters,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}) {
  return (
    <div className="folderFilterSidebar">
      <Sidebar
        className="highZIndex"
        sidebarClasses="filterSidebar"
        sidebarOpen={open}
        setSidebarOpen={setOpen}
      >
        <SidebarHeader title="Apply Filters" />
        <SidebarContent>
          <form className="dataContainer">
            <div className="filtersContainer">
              {filters &&
                filters.map((filter) => (
                  <div key={filter.id} className="filterContainer">
                    <div className="filterHeader">
                      <Title>{filter.name}</Title>
                    </div>
                    <div className="filterBody">
                      {filter.data &&
                        filter.data.map((item) => (
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
                              }
                            }}
                            name={item.name}
                            parentName={filter.name}
                            title={item.name}
                          />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </form>
        </SidebarContent>
        <SidebarFooterContainer>
          <ClearButton
            type="button"
            onClick={() => {
              setOpen(false);
            }}
            className="leftClearButton"
          >
            <MemoBack />
            Cancel
          </ClearButton>
          <Button
            onClick={() => setOpen(false)}
            type="button"
            className="rightFullButton"
          >
            <MemoCheckmark />
            Apply
          </Button>
        </SidebarFooterContainer>
      </Sidebar>
    </div>
  );
}
