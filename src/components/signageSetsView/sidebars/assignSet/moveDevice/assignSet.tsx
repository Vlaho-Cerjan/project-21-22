import type {AgGridReact} from 'ag-grid-react';
import React from 'react';

import {ModalDivider} from '@/src/components/common/divider/divider';
import Sidebar from '@/src/components/common/sidebar/sidebar';
import SidebarContent from '@/src/components/common/sidebar/sidebarContent';
import SidebarFooter from '@/src/components/common/sidebar/sidebarFooter';
import SidebarHeader from '@/src/components/common/sidebar/sidebarHeader';
import {
  fakeArea,
  fakeData,
  fakeVenue,
} from '@/src/components/dataGrid/fakeData';
import type {BackendSignageData} from '@/src/constants/backendData';
import MemoCheckmark from '@/src/icons/checkmark';

import ActionDataGrid from './assignSetGrid';

export default function AssignSet({
  open,
  setOpen,
  signageData,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  signageData: BackendSignageData;
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
      const signageVenues = fakeVenue.filter((item) =>
        signageData.assigned?.some((tempItem) => tempItem.venue === item.id),
      );
      gridRef.current.api.forEachNode((rowNode) => {
        if (
          rowNode.data &&
          signageVenues.some((tempItem) => tempItem.id === rowNode.data.id)
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
      className="assignSet"
      sidebarClasses="assignSetSidebar"
    >
      <SidebarHeader
        title="Assign Signage Set"
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
        sidebarClass="assignSetSidebar"
        isError={isError}
        setIsError={setIsError}
        buttonText="Save changes"
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
            onSubmit(signageData.id, selectedRowsData);
          }
        }}
      />
    </Sidebar>
  );
}
