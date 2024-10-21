import type {AgGridReact} from 'ag-grid-react';
import React from 'react';

import {ModalDivider} from '@/src/components/common/divider/divider';
import Sidebar from '@/src/components/common/sidebar/sidebar';
import SidebarFooter from '@/src/components/common/sidebar/sidebarFooter';
import SidebarHeader from '@/src/components/common/sidebar/sidebarHeader';
import {
  fakeArea,
  fakeData,
  fakeVenue,
} from '@/src/components/dataGrid/fakeData';
import type {BackendScheduleData} from '@/src/constants/backendData';
import MemoCheckmark from '@/src/icons/checkmark';

import SidebarContent from '../../../../common/sidebar/sidebarContent';
import ActionDataGrid from './assignScheduleGrid';

export default function AssignSchedule({
  open,
  setOpen,
  scheduleData,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleData: BackendScheduleData;
  onSubmit: (
    id: string,
    data: {
      area: string;
      venue?: string;
      deviceId: string;
    }[],
  ) => 'error' | 'success' | 'info';
}) {
  const gridRef = React.useRef<AgGridReact | null>(null);
  const [isError, setIsError] = React.useState(false);
  const closeSidebarFunction = () => {
    setOpen(false);
    // reset form fields
  };

  React.useEffect(() => {
    if (open && gridRef && gridRef.current && gridRef.current.api) {
      const node: any = [];
      const scheduleVenues = fakeVenue.filter((item) =>
        scheduleData.assigned?.some((tempItem) => tempItem.venue === item.id),
      );
      gridRef.current.api.forEachNode((rowNode) => {
        if (
          rowNode.data &&
          scheduleVenues.some((tempItem) => tempItem.id === rowNode.data.id)
        ) {
          node.push(rowNode);
        }
      });
      gridRef.current.api.setNodesSelected({
        nodes: node,
        newValue: true,
      });
    }
  }, [open]);

  return (
    <Sidebar
      sidebarOpen={open}
      setSidebarOpen={setOpen}
      closeSidebarFunction={closeSidebarFunction}
      className="assignSchedule"
      sidebarClasses="assignScheduleSidebar"
    >
      <SidebarHeader
        title="Assign Schedule"
        description="Assign to Network, Area, Venue, and Device."
      />
      <SidebarContent>
        <form className="formContainer">
          <div className="dataContainer">
            <ActionDataGrid
              ref={gridRef}
              data={[
                ...fakeData.map((item) => ({
                  ...item,
                  orgHierarchy: [
                    fakeArea.find((areaItem) => areaItem.id === item.area)
                      ?.name,
                    fakeVenue.find((venueItem) => venueItem.id === item.venue)
                      ?.name || '',
                    item.deviceName,
                  ],
                })),
                ...fakeVenue.map((item) => ({
                  ...item,
                  orgHierarchy: [
                    fakeArea.find((areaItem) => areaItem.id === item.areaId)
                      ?.name,
                    item.name,
                  ],
                })),
                ...fakeArea.map((item) => ({
                  ...item,
                  orgHierarchy: [item.name],
                })),
              ]}
            />
          </div>
        </form>
      </SidebarContent>
      <ModalDivider />
      <SidebarFooter
        setOpen={setOpen}
        setIsError={setIsError}
        isError={isError}
        sidebarClass="assignScheduleSidebar"
        buttonText="Save changes"
        loadingText="Saving changes..."
        successText="Changes saved!"
        buttonIcon={<MemoCheckmark />}
        backButtonFunction={() => {
          closeSidebarFunction();
        }}
        onSubmit={() => {
          const gridRefApi = gridRef.current?.api;
          if (gridRefApi) {
            const selectedRows = gridRefApi.getSelectedRows();
            const selectedRowsData = selectedRows.map((row) => ({
              area:
                row.area ||
                fakeArea.find((item) => item.id === row.areaId)?.id ||
                fakeArea.find((item) => item.id === row.id)?.id,
              venue:
                row.venue ||
                (row.areaId &&
                  fakeVenue.find((item) => item.areaId && item.id === row.id)
                    ?.id) ||
                null,
              deviceId: row.area || row.venue ? row.id : null,
            }));
            onSubmit(scheduleData.id, selectedRowsData);
          }
        }}
      />
    </Sidebar>
  );
}
