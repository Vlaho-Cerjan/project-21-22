import type {AgGridReact} from 'ag-grid-react';
import React from 'react';

import SidebarContent from '@/src/components/common/sidebar/sidebarContent';
import SidebarFooter from '@/src/components/common/sidebar/sidebarFooter';
import SidebarHeader from '@/src/components/common/sidebar/sidebarHeader';
import MemoBack from '@/src/icons/back';

import {ModalDivider} from '../../../common/divider/divider';
import Sidebar from '../../../common/sidebar/sidebar';
import {fakeArea, fakeVenue} from '../../../dataGrid/fakeData';
import ActionDataGrid from './moveDeviceGrid';

export default function MoveDevice({
  open,
  setOpen,
  deviceData,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deviceData: any;
  onSubmit: (data: {
    id: string;
    area: string;
    venue?: string;
  }) => 'error' | 'success' | 'info';
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
      const deviceVenue = fakeVenue.find(
        (item) => item.id === deviceData.venue,
      );
      gridRef.current.api.forEachNode((rowNode) => {
        if (rowNode.data && rowNode.data.name === deviceVenue?.name) {
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
      className="moveDevice"
      sidebarClasses="moveDeviceSidebar"
    >
      <SidebarHeader
        title="Move Device"
        description="Move your device to a new Venue."
      />
      <SidebarContent>
        <form className="formContainer">
          <div className="dataContainer">
            <ActionDataGrid
              ref={gridRef}
              data={fakeVenue.map((item) => ({
                ...item,
                area: fakeArea.find((areaItem) => areaItem.id === item.areaId)
                  ?.name,
              }))}
            />
          </div>
        </form>
      </SidebarContent>
      <ModalDivider />
      <SidebarFooter
        setOpen={setOpen}
        sidebarClass="moveDeviceSidebar"
        isError={isError}
        setIsError={setIsError}
        noIcon
        buttonText="Save changes"
        loadingText="Saving changes..."
        successText="Changes saved!"
        onSubmit={() => {
          const gridRefApi = gridRef.current?.api;
          if (gridRefApi) {
            onSubmit({
              id: deviceData.id,
              area: gridRefApi.getSelectedRows()[0].areaId,
              venue: gridRefApi.getSelectedRows()[0].id,
            });
          }
        }}
        backButtonText="Cancel"
        backButtonIcon={<MemoBack />}
        backButtonFunction={() => {
          closeSidebarFunction();
        }}
      />
    </Sidebar>
  );
}
