import MemoBell from '@/src/icons/bell';
import MemoMenuBurgerOld from '@/src/icons/menu-burger-old';
import MemoProfile from '@/src/icons/profile';
import type {SessionUser} from 'next-auth';
import {getSession} from 'next-auth/react';
import dynamic from 'next/dynamic';
import React from 'react';
import Description from '../../common/description/description';
import Divider from '../../common/divider/divider';
import IconButton from '../../common/iconButton/iconButton';
import Title from '../../common/title/title';

const RcDropdownLazy = dynamic(() => import('rc-dropdown'), {ssr: false});

export default function ProfileDropdown({
  setMobileNavOpen,
  setProfileOpen,
  SignOutFunction,
}: {
  setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  SignOutFunction: () => void;
}) {
  const [userData, setUserData] = React.useState<SessionUser | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      setUserData(session?.user || null);
    };
    fetchData();
  }, []);

  return (
    <div className="navIconContainer">
      <IconButton
        data-tooltip-id="notifTooltip"
        data-tooltip-content="Notifications"
        icon={<MemoBell />}
      />
      {/*
          <IconButton icon={<MemoSettings />} />

          */}
      <RcDropdownLazy
        overlayClassName="profileDropdown"
        trigger={['click']}
        overlay={
          <div>
            <div className="dropdownHeader">
              <Title>{userData?.first_name}</Title>
              <Description>{userData?.job_title}</Description>
            </div>
            <Divider />
            <div className="dropdownContent">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(true);
                }}
                className="dropdownButton"
              >
                Profile
              </button>
              <button
                onClick={() => SignOutFunction()}
                type="button"
                className="dropdownButton"
              >
                Sign Out
              </button>
            </div>
          </div>
        }
      >
        <IconButton
          data-tooltip-id="profileTooltip"
          data-tooltip-content="Profile Settings"
          id="profileDropdownButton"
          className="dropdownButton"
          icon={<MemoProfile />}
          style={{
            marginRight: '0',
          }}
        />
      </RcDropdownLazy>
      <IconButton
        data-tooltip-id="menuTooltip"
        data-tooltip-content="Menu"
        onClick={() => setMobileNavOpen(true)}
        containerProps={{
          className: 'menuBurger',
        }}
        style={{
          marginLeft: '0',
        }}
        icon={<MemoMenuBurgerOld />}
      />
    </div>
  );
}
