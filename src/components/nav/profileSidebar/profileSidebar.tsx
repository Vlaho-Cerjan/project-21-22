import React from 'react';

import ClientApiRequest from '@/src/lib/clientApiRouter';
import type {CustomUser} from '@/types/next-auth';
import {useSession} from 'next-auth/react';
import {toast} from 'react-toastify';
import {ModalDivider} from '../../common/divider/divider';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalPhoneLabel from '../../common/modalPhoneLabel/modalPhoneLabel';
import Sidebar from '../../common/sidebar/sidebar';
import SidebarContent from '../../common/sidebar/sidebarContent';
import SidebarFooter from '../../common/sidebar/sidebarFooter';
import SidebarHeader from '../../common/sidebar/sidebarHeader';

const UpdateUser = async (data: {
  first_name: string;
  last_name: string;
  job_title: string;
  email: string;
  mobile_number: string;
}): Promise<{
  success: boolean;
  data?: CustomUser;
  message?: string;
}> => {
  const res = await ClientApiRequest({
    uri: 'api/user',
    method: 'PUT',
    data,
  });

  return res;
};

export default function ProfileSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [jobTitle, setJobTitle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const session = useSession();

  const closeSidebarFunction = () => {
    // reset form fields
    setTimeout(() => {
      setFirstName(session.data?.user?.first_name || '');
      setLastName(session.data?.user?.last_name || '');
      setJobTitle(session.data?.user?.job_title || '');
      setEmail(session.data?.user?.email || '');
      setMobileNumber(session.data?.user?.mobile_number || '');
      setNewPassword('');
      setConfirmPassword('');
    }, 150);
  };

  const handleSubmit = async () => {
    const res = await UpdateUser({
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      email,
      mobile_number: mobileNumber,
    });

    if (res.success) {
      toast.success('Profile updated successfully');
      return 'success';
    }

    if (res.message) {
      toast.error(res.message);
    }

    return 'error';
  };

  React.useEffect(() => {
    const user = session.data?.user;
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setJobTitle(user.job_title || '');
      setEmail(user.email || '');
      setMobileNumber(user.mobile_number || '');
    }
  }, []);

  return (
    <Sidebar
      sidebarOpen={open}
      sidebarClasses="profileSidebar"
      setSidebarOpen={setOpen}
      closeSidebarFunction={closeSidebarFunction}
      className="profile"
    >
      <SidebarHeader title="Profile" description="Edit your profile." />
      <SidebarContent>
        <form className="profileFormContainer">
          <div className="nameContainer">
            <div className="row">
              <ModalInputLabel
                labelText="First Name"
                inputProps={{
                  id: 'userFirstName',
                  name: 'userFirstName',
                  'data-testid': 'userFirstName',
                  value: firstName,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setFirstName(e.target.value);
                  },
                  placeholder: 'Enter First Name',
                }}
              />
              <ModalInputLabel
                labelText="Last Name"
                inputProps={{
                  id: 'userLastName',
                  name: 'userLastName',
                  'data-testid': 'userLastName',
                  value: lastName,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setLastName(e.target.value);
                  },
                  placeholder: 'Enter Last Name',
                }}
              />
            </div>
            <ModalInputLabel
              labelText="Email"
              inputProps={{
                id: 'userEmail',
                name: 'userEmail',
                'data-testid': 'userEmail',
                type: 'email',
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                },
                placeholder: 'Enter Email',
              }}
            />
            <ModalPhoneLabel
              labelText="Mobile Number"
              data={mobileNumber}
              setData={(number: string) => {
                setMobileNumber(number);
              }}
              inputProps={{
                id: 'userMobileNumber',
                name: 'userMobileNumber',
                'data-testid': 'userMobileNumber',
                type: 'tel',
                placeholder: 'Enter Mobile Number',
              }}
            />
            <ModalInputLabel
              labelText="Job Title"
              inputProps={{
                id: 'userJobTitle',
                name: 'userJobTitle',
                'data-testid': 'userJobTitle',
                type: 'text',
                value: jobTitle,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setJobTitle(e.target.value);
                },
                placeholder: 'Enter Job Title',
              }}
            />
          </div>
          <ModalDivider />
          <div className="dataContainer">
            <ModalInputLabel
              labelText="New Password"
              inputProps={{
                id: 'userNewPassword',
                name: 'userNewPassword',
                'data-testid': 'userNewPassword',
                autoComplete: 'new-password',
                type: 'password',
                value: newPassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPassword(e.target.value);
                },
                placeholder: 'Enter New Password',
              }}
            />
            <ModalInputLabel
              labelText="Confirm Password"
              inputProps={{
                id: 'userConfirmPassword',
                name: 'userConfirmPassword',
                'data-testid': 'confirmPassword',
                autoComplete: 'confirm-password',
                type: 'password',
                value: confirmPassword,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value);
                },
                placeholder: 'Confirm New Password',
              }}
            />
          </div>
        </form>
      </SidebarContent>
      <SidebarFooter
        sidebarClass="profileSidebar"
        setOpen={setOpen}
        isError={isError}
        setIsError={setIsError}
        buttonText="Save Changes"
        noIcon
        loadingText="Saving..."
        successText="Changes Saved"
        onSubmit={async () => {
          const res = await handleSubmit();
          if (res === 'success') {
            return 'success';
          }
          return 'error';
        }}
      />
    </Sidebar>
  );
}
