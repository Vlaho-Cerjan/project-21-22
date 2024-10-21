import React from 'react';

import {ModalDivider} from '../../common/divider/divider';
import ModalSelectLabel from '../../common/modalSelectLabel/modalSelectLabel';
import Sidebar from '../../common/sidebar/sidebar';
import SidebarContent from '../../common/sidebar/sidebarContent';
import SidebarFooter from '../../common/sidebar/sidebarFooter';
import SidebarHeader from '../../common/sidebar/sidebarHeader';

export default function EditNetwork({
  open,
  setOpen,
  network,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  network: {
    id: string;
    signage: string;
    schedule: string;
    policy: string;
  };
  onSubmit: (data: {
    id: string;
    signage: string;
    schedule: string;
    policy: string;
  }) => 'error' | 'success';
}) {
  const [signage, setSignage] = React.useState(network.signage);
  const [schedule, setSchedule] = React.useState(network.schedule);
  const [policy, setPolicy] = React.useState(network.policy);
  const [isError, setIsError] = React.useState(false);

  const closeSidebarFunction = () => {
    setOpen(false);
    // reset form fields
    setTimeout(() => {
      setSignage(network.signage);
      setSchedule(network.schedule);
      setPolicy(network.policy);
    }, 150);
  };

  return (
    <Sidebar
      sidebarOpen={open}
      setSidebarOpen={setOpen}
      closeSidebarFunction={closeSidebarFunction}
      className="editNetwork"
      sidebarClasses="editNetworkSidebar"
    >
      <SidebarHeader
        title="Edit Network"
        description="Edit your entire Device Network."
      />
      <SidebarContent>
        <form className="formContainer">
          <div className="dataContainer">
            <ModalSelectLabel
              labelText="Network Signage"
              selectProps={{
                value: signage,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setSignage(e.target.value);
                },
                placeholder: 'Choose Network Signage',
              }}
              data={[
                {id: '1', name: 'Holiday Signage'},
                {id: '2', name: 'Safety Signage'},
                {id: '3', name: 'Other Signage'},
              ]}
            />
            <ModalSelectLabel
              labelText="Network Schedule"
              selectProps={{
                value: schedule,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setSchedule(e.target.value);
                },
                placeholder: 'Choose Network Schedule',
              }}
              data={[
                {id: '1', name: 'Holiday Signage'},
                {id: '2', name: 'Safety Signage'},
                {id: '3', name: 'Other Signage'},
              ]}
            />
            <ModalSelectLabel
              labelText="Network Policy"
              selectProps={{
                value: policy,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setPolicy(e.target.value);
                },
                placeholder: 'Choose Network Policy',
              }}
              data={[
                {id: '1', name: 'Holiday Signage'},
                {id: '2', name: 'Safety Signage'},
                {id: '3', name: 'Other Signage'},
              ]}
            />
          </div>
        </form>
      </SidebarContent>
      <ModalDivider />
      <SidebarFooter
        sidebarClass="editNetworkSidebar"
        isError={isError}
        setIsError={setIsError}
        setOpen={setOpen}
        noIcon
        buttonText="Save Changes"
        onSubmit={() => {
          const result = onSubmit({
            id: network.id,
            signage,
            schedule,
            policy,
          });
          if (result === 'success') {
            closeSidebarFunction();
          }
        }}
        loadingText="Saving..."
        successText="Changes Saved"
      />
    </Sidebar>
  );
}
