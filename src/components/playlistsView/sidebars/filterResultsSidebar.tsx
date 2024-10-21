import ClearButton from '@/src/components/common/button/clearButton';
import MemoBack from '@/src/icons/back';
import MemoCheckmark from '@/src/icons/checkmark';

import Button from '../../common/button/button';
import Checkmark from '../../common/checkmark/checkmark';
import Sidebar from '../../common/sidebar/sidebar';
import SidebarContent from '../../common/sidebar/sidebarContent';
import {SidebarFooterContainer} from '../../common/sidebar/sidebarFooter';
import SidebarHeader from '../../common/sidebar/sidebarHeader';
import Title from '../../common/title/title';

export interface Filters {
  id: string;
  name: string;
  data: {
    id: string;
    name: string;
    checked: boolean;
  }[];
}

export default function FilterResultSidebar({
  open,
  setOpen,
  filters,
  setFilters,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: {
    id: string;
    name: string;
    data: {
      id: string;
      name: string;
      checked: boolean;
    }[];
  }[];
  setFilters: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
        data: {
          id: string;
          name: string;
          checked: boolean;
        }[];
      }[]
    >
  >;
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
                    <div className="filterBodyContainer">
                      {filter.data &&
                        filter.data.map((data) => (
                          <div key={data.id} className="filterBody">
                            <Checkmark
                              title={data.name}
                              value={data.checked}
                              setValue={(value) => {
                                setFilters((prevFilters) =>
                                  prevFilters.map((prevFilter) => {
                                    if (prevFilter.id === filter.id) {
                                      return {
                                        ...prevFilter,
                                        data: prevFilter.data.map((prevData) =>
                                          prevData.id === data.id
                                            ? {
                                                ...prevData,
                                                checked: value,
                                              }
                                            : prevData,
                                        ),
                                      };
                                    }
                                    return prevFilter;
                                  }),
                                );
                              }}
                            />
                          </div>
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
