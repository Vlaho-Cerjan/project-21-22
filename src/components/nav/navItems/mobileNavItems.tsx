import dynamic from 'next/dynamic';
import {usePathname} from 'next/navigation';
import React from 'react';

import MemoAccountSettings from '@/src/icons/account-settings';
import MemoCloudDevice from '@/src/icons/cloud-device-old';
import MemoHome from '@/src/icons/home';
import MemoRightGrey from '@/src/icons/right-grey';
import MemoSignOut from '@/src/icons/sign-out';
import MemoSupport from '@/src/icons/support';
import MemoUserRoles from '@/src/icons/user-roles';

import MemoAdmin from '@/src/icons/admin';
import type {SessionUser} from 'next-auth';
import {getSession} from 'next-auth/react';
import Description from '../../common/description/description';
import IconButton from '../../common/iconButton/iconButton';
import Link from '../../common/link/link';
import Title from '../../common/title/title';

const ProfileSubNavLazy = dynamic(
  () => import('../profileSubNav/profileSubNav'),
  {ssr: false},
);

export default function MobileNavItems({
  setMobileNavOpen,
  navItems,
  adminNavItems,
  subnavType,
  setSubnavType,
  subnavOpen,
  setSubnavOpen,
  setMobileNavOpenDelay,
  isAdmin,
}: {
  setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navItems: React.JSX.Element;
  adminNavItems: React.JSX.Element;
  subnavType: 'admin' | 'resources' | 'profile';
  setSubnavType: React.Dispatch<
    React.SetStateAction<'admin' | 'resources' | 'profile'>
  >;
  subnavOpen: boolean;
  setSubnavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileNavOpenDelay: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [userData, setUserData] = React.useState<SessionUser | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      setUserData(session?.user || null);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    // remove active class from all nav items
    const navItemsEl = document.querySelectorAll('.navItem');
    navItemsEl.forEach((navItem) => {
      navItem.classList.remove('active');
    });
    // get nav item that matches current URL or has a child that matches current URL
    const navItem = document.querySelector(`.navItem[href="${pathname}"]`);
    if (navItem) {
      navItem.classList.add('active');
    }
  }, [pathname]);

  React.useEffect(() => {
    if (!subnavOpen)
      setTimeout(() => {
        setProfileOpen(false);
      }, 500);
  }, [subnavOpen]);

  return (
    <div
      className={`navMobileItemsContentContainer${
        subnavOpen ? ' activeSubNav' : ''
      }`}
    >
      <div className="navMobileItems">
        <div className="topNav">
          <Link
            href="/"
            className="navItem"
            onClick={() => {
              setMobileNavOpenDelay(false);
              setTimeout(() => {
                setMobileNavOpen(false);
                setSubnavOpen(false);
              }, 400);
            }}
          >
            <div>
              <MemoHome />
              <span>Home</span>
            </div>
          </Link>
          <div>
            <button
              onClick={() => {
                setSubnavType('resources');
                setTimeout(() => {
                  setSubnavOpen(!subnavOpen);
                }, 10);
              }}
              type="button"
              className="navItem navButton"
            >
              <div>
                <MemoCloudDevice />
                <span>Resources</span>
              </div>
              <div className="rightIconContainer">
                <MemoRightGrey />
              </div>
            </button>
            {
              // <NetworkDropdown subnavOpen={subnavOpen} />
            }
          </div>
          {/*
          <Link
            href="/orders"
            className="navItem"
            onClick={() => {
              setMobileNavOpenDelay(false);
              setTimeout(() => {
                setMobileNavOpen(false);
                setSubnavOpen(false);
              }, 400);
            }}
          >
            <div>
              <MemoNavCart />
              <span>Orders</span>
            </div>
          </Link>
          */}
          <Link
            href="/roles"
            className="navItem"
            onClick={() => {
              setMobileNavOpenDelay(false);
              setTimeout(() => {
                setMobileNavOpen(false);
                setSubnavOpen(false);
              }, 400);
            }}
          >
            <div>
              <MemoUserRoles />
              <span>Roles</span>
            </div>
          </Link>
          {isAdmin && (
            <div>
              <button
                onClick={() => {
                  setSubnavType('admin');
                  setTimeout(() => {
                    setSubnavOpen(!subnavOpen);
                  }, 10);
                }}
                type="button"
                className="navItem navButton"
              >
                <div>
                  <MemoAdmin />
                  <span>Admin</span>
                </div>
                <div className="rightIconContainer">
                  <MemoRightGrey />
                </div>
              </button>
            </div>
          )}
        </div>
        <div className="bottomNav">
          <Link
            href="/support"
            className="navItem"
            onClick={() => {
              setMobileNavOpenDelay(false);
              setTimeout(() => {
                setMobileNavOpen(false);
                setSubnavOpen(false);
              }, 400);
            }}
          >
            <div>
              <MemoSupport />
              <span>Support</span>
            </div>
          </Link>
          <button
            type="button"
            className="navItem navButton"
            onClick={() => {
              setProfileOpen(true);
              setSubnavType('profile');
              setTimeout(() => {
                setSubnavOpen(true);
              }, 10);
            }}
          >
            <div>
              <MemoAccountSettings />
              <span>Account Settings</span>
            </div>
            <div>
              <div className="rightIconContainer">
                <MemoRightGrey />
              </div>
            </div>
          </button>
        </div>
        <div className="navMobileProfileFooter">
          <div className="footerLeft">
            {/*
            <div className="profileIconContainer">
              <Image
                src="/assets/images/max.png"
                alt="Profile Picture of User"
                width={34}
                height={34}
              />
            </div>
          */}
            <div className="profileTextContainer">
              <Title>{`${userData?.first_name} ${userData?.last_name}`}</Title>
              <Description>{userData?.job_title}</Description>
            </div>
          </div>
          <div className="footerRight">
            <div className="rightIconContainer">
              <IconButton
                data-tooltip-id="signOutTooltip"
                data-tooltip-content="Sign Out"
                tooltipProps={{
                  id: 'signOutTooltip',
                }}
                icon={<MemoSignOut />}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="networkSubNav">
        {subnavType === 'profile' && profileOpen && (
          <ProfileSubNavLazy
            setSubnavOpen={setSubnavOpen}
            setProfileOpen={setProfileOpen}
          />
        )}
        {subnavType === 'resources' ? navItems : null}
        {subnavType === 'admin' ? adminNavItems : null}
      </div>
    </div>
  );
}
