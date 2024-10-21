import React from 'react';

import MemoBack from '@/src/icons/back';

import ClientApiRequest from '@/src/lib/clientApiRouter';
import type {CustomUser} from '@/types/next-auth';
import type {SessionUser} from 'next-auth';
import {getSession} from 'next-auth/react';
import {toast} from 'react-toastify';
import FormButton from '../../auth/common/formButton/formButton';
import ClearButton from '../../common/button/clearButton';
import {ModalDivider} from '../../common/divider/divider';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalPhoneLabel from '../../common/modalPhoneLabel/modalPhoneLabel';

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

export default function ProfileSubNav({
  setSubnavOpen,
  setProfileOpen,
}: {
  setSubnavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [jobTitle, setJobTitle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [userData, setUserData] = React.useState<SessionUser | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      setUserData(session?.user || null);
    };
    fetchData();
  }, []);

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
    if (userData) {
      setFirstName(userData.first_name || '');
      setLastName(userData.last_name || '');
      setJobTitle(userData.job_title || '');
      setEmail(userData.email || '');
      setMobileNumber(userData.mobile_number || '');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [userData]);

  const closeSidebarFunction = () => {
    setSubnavOpen(false);
    setTimeout(() => {
      setProfileOpen(false);
    }, 250);
    // reset form fields
    setTimeout(() => {
      setFirstName('');
      setLastName('');
      setJobTitle('');
      setEmail('');
      setMobileNumber('');
      setNewPassword('');
      setConfirmPassword('');
    }, 150);
  };

  return (
    <div className="profileSubnav">
      <div className="sidebarContentContainer">
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
      </div>
      <div className="sidebarFooter">
        <ClearButton
          type="button"
          onClick={() => {
            closeSidebarFunction();
          }}
          className="leftClearButton"
        >
          <MemoBack />
          Cancel
        </ClearButton>
        <FormButton
          setOpen={setSubnavOpen}
          onSubmit={() => {}}
          isError={isError}
          setIsError={setIsError}
          className="rightFullButton"
          type="button"
          text="Save Changes"
          noIcon
          onClick={async () => {
            const res = await handleSubmit();
            if (res === 'success') {
              return 'success';
            }
            return 'error';
          }}
        />
      </div>
    </div>
  );
}
