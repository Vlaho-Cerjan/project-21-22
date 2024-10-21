'use client';
import {signOut} from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import MemoBlueLeftArrow from '@/src/icons/blue-left-arrow';
import MemoClear from '@/src/icons/clear';
import MemoMediaAssets from '@/src/icons/media-assets';
import MemoNavDevices from '@/src/icons/nav-devices';
import MemoPlaylists from '@/src/icons/playlists';
import MemoPolicies from '@/src/icons/policies';
import MemoSchedules from '@/src/icons/schedules';
import MemoSignageSets from '@/src/icons/signage-sets';
import {LockBody} from '@/src/utils/LockBodyOverflow';

import MemoBusinessNav from '@/src/icons/business-nav';
import MemoExternalVideos from '@/src/icons/external-videos';
import MemoScreen from '@/src/icons/Icons/screen';
import MemoLayoutNav from '@/src/icons/layout-nav';
import MemoProjectLogoBig from '@/src/icons/project-logo-big';
import MemoManagedNav from '@/src/icons/managed-nav';
import MemoMixesNav from '@/src/icons/mixes-nav';
import MemoMusicVideosNav from '@/src/icons/music-videos-nav';
import MemoOrders from '@/src/icons/orders';
import MemoPlaylistsNav from '@/src/icons/playlists-nav';
import MemoSchedulesNav from '@/src/icons/schedules-nav';
import MemoVenuesNav from '@/src/icons/venuesNav';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import IsItAdmin from '@/src/utils/IsItAdmin';
import ClearButton from '../common/button/clearButton';
import IconButton from '../common/iconButton/iconButton';
import StyledLink from '../common/link/link';
import Text from '../common/text/text';
import NavItems from './navItems/navItems';
import ProfileDropdown from './profileDropdown/profileDropdown';

const ProfileSidebarComponent = dynamic(
  () => import('./profileSidebar/profileSidebar'),
  {ssr: false},
);

const MobileNavItemsLazy = dynamic(() => import('./navItems/mobileNavItems'), {
  ssr: false,
});

export default function MainNav() {
  const {width} = useWindowSize();

  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [mobileNavOpenDelay, setMobileNavOpenDelay] = React.useState(false); // Used to delay the mobile nav open animation
  const [subnavOpen, setSubnavOpen] = React.useState(false);
  const [subnavType, setSubnavType] = React.useState<
    'admin' | 'resources' | 'profile'
  >('resources');
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [profileOpenDelay, setProfileOpenDelay] = React.useState(false); // Used to delay the profile sidebar open animation
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      setIsAdmin(await IsItAdmin());
    };
    checkAdmin();
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setProfileOpenDelay(true);
    }, 500);
  }, []);

  React.useEffect(() => {
    if (width > 992) setMobileNavOpen(false);
  }, [width]);

  React.useEffect(() => {
    LockBody(mobileNavOpen);

    if (mobileNavOpen)
      setTimeout(() => {
        setMobileNavOpenDelay(mobileNavOpen);
      }, 300);
    else {
      setMobileNavOpenDelay(mobileNavOpen);
    }
  }, [mobileNavOpen]);

  const SignOutFunction = async () => {
    const res = await ClientApiRequest({
      uri: 'auth/logout',
      method: 'PUT',
      auth: true,
    });

    if (res.success || (!res.success && res.message === 'unauthorized')) {
      await signOut({
        redirect: true,
      });
    }
  };

  const adminItems = (
    <>
      <div className="contentContainer mainSubnavContainer">
        <StyledLink
          className="dropdownNavLink"
          href="/admin/music-videos"
          onClick={() => {
            setMobileNavOpenDelay(false);
            setTimeout(() => {
              setMobileNavOpen(false);
              setSubnavOpen(false);
            }, 400);
          }}
        >
          <MemoMusicVideosNav />
          <Text className="dropdownNavText">Music Videos</Text>
        </StyledLink>
        <StyledLink
          className="dropdownNavLink"
          href="/admin/external-videos"
          onClick={() => {
            setMobileNavOpenDelay(false);
            setTimeout(() => {
              setMobileNavOpen(false);
              setSubnavOpen(false);
            }, 400);
          }}
        >
          <MemoExternalVideos />
          <Text className="dropdownNavText">External Videos</Text>
        </StyledLink>
        <StyledLink
          className="dropdownNavLink"
          href="/admin/layout"
          onClick={() => {
            setMobileNavOpenDelay(false);
            setTimeout(() => {
              setMobileNavOpen(false);
              setSubnavOpen(false);
            }, 400);
          }}
        >
          <MemoLayoutNav />
          <Text className="dropdownNavText">Layout</Text>
        </StyledLink>
        <StyledLink
          className="dropdownNavLink"
          href="/admin/playlists"
          onClick={() => {
            setMobileNavOpenDelay(false);
            setTimeout(() => {
              setMobileNavOpen(false);
              setSubnavOpen(false);
            }, 400);
          }}
        >
          <MemoPlaylistsNav />
          <Text className="dropdownNavText">Playlists</Text>
        </StyledLink>
        <StyledLink
          className="dropdownNavLink"
          href="/admin/mixes"
          onClick={() => {
            setMobileNavOpenDelay(false);
            setTimeout(() => {
              setMobileNavOpen(false);
              setSubnavOpen(false);
            }, 400);
          }}
        >
          <MemoMixesNav />
          <Text className="dropdownNavText">Mixes</Text>
        </StyledLink>
        <StyledLink
          className="dropdownNavLink"
          href="/admin/schedules"
          onClick={() => {
            setMobileNavOpenDelay(false);
            setTimeout(() => {
              setMobileNavOpen(false);
              setSubnavOpen(false);
            }, 400);
          }}
        >
          <MemoSchedulesNav />
          <Text className="dropdownNavText">Schedules</Text>
        </StyledLink>
      </div>
      <div className="contentContainer adminSubnavContainer">
        <StyledLink
          className="dropdownNavLink"
          href="/admin/registrations"
          onClick={() => {
            setMobileNavOpenDelay(false);
            setTimeout(() => {
              setMobileNavOpen(false);
              setSubnavOpen(false);
            }, 400);
          }}
        >
          <MemoBusinessNav />
          <Text className="dropdownNavText">Registrations</Text>
        </StyledLink>
        <StyledLink
          className="dropdownNavLink"
          href="/admin/businesses"
          onClick={() => {
            setMobileNavOpenDelay(false);
            setTimeout(() => {
              setMobileNavOpen(false);
              setSubnavOpen(false);
            }, 400);
          }}
        >
          <MemoManagedNav />
          <Text className="dropdownNavText">Businesses</Text>
        </StyledLink>
      </div>
    </>
  );

  const navItems = (
    <>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/screens"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoScreen />
        <Text className="dropdownNavText">Screens</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/venues"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoVenuesNav />
        <Text className="dropdownNavText">Venues</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/orders"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoOrders />
        <Text className="dropdownNavText">Orders</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/players"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoNavDevices />
        <Text className="dropdownNavText">Players</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/media-assets"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoMediaAssets />
        <Text className="dropdownNavText">Media Assets</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/signage-sets"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoSignageSets />
        <Text className="dropdownNavText">Signage Sets</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/playlists"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoPlaylists />
        <Text className="dropdownNavText">Playlists</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/mixes"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoPlaylists />
        <Text className="dropdownNavText">Playlist Mixes</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/schedules"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoSchedules />
        <Text className="dropdownNavText">Schedules</Text>
      </StyledLink>
      <StyledLink
        className="dropdownNavLink"
        href="/resources/policies"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoPolicies />
        <Text className="dropdownNavText">Policies</Text>
      </StyledLink>
      {/*
      <StyledLink
        className="dropdownNavLink"
        href="/resources/rewards"
        onClick={() => {
          setMobileNavOpenDelay(false);
          setTimeout(() => {
            setMobileNavOpen(false);
            setSubnavOpen(false);
          }, 400);
        }}
      >
        <MemoRewards />
        <Text className="dropdownNavText">Rewards</Text>
      </StyledLink>
      */}
    </>
  );

  return (
    <div className="mainNavContainer">
      <div className="mainNav">
        <div className="logoContainer">
          <Link
            aria-label="logo image leads to dashboard"
            className="logoLink"
            href="/"
          >
            <MemoProjectLogoBig />
          </Link>
        </div>
        <NavItems
          isAdmin={isAdmin}
          adminItems={adminItems}
          navItems={navItems}
          className="navContainer"
        />
        <ProfileDropdown
          setMobileNavOpen={setMobileNavOpen}
          setProfileOpen={setProfileOpen}
          SignOutFunction={SignOutFunction}
        />
        {mobileNavOpen && (
          <>
            <div
              tabIndex={0}
              role="button"
              aria-label='Close menu by pressing "Escape" key or clicking outside of menu.'
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setTimeout(() => {
                    setMobileNavOpen(false);
                    setSubnavOpen(false);
                  }, 400);
                  setMobileNavOpenDelay(false);
                }
              }}
              onClick={() => {
                setTimeout(() => {
                  setMobileNavOpen(false);
                  setSubnavOpen(false);
                }, 400);
                setMobileNavOpenDelay(false);
              }}
              id="navMobileBackdrop"
              className={`navMobileTabletOverlay${
                mobileNavOpenDelay ? ` open` : ''
              }`}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label='Close menu by pressing "Escape" key or clicking outside of menu.'
              className={`navMobileTopContainer${
                mobileNavOpenDelay ? ` open` : ''
              }${subnavOpen ? ' activeSubNav' : ''}`}
            >
              <div className="navMobile">
                <div className="navMobileContent">
                  <div className="navMobileHeader">
                    <div className="logoContainer navLogoContainer">
                      <div className="logoLink">
                        <MemoProjectLogoBig />
                      </div>
                      <div className="backButtonContainer">
                        <ClearButton
                          onClick={() => setSubnavOpen(false)}
                          type="button"
                          className="backButton"
                        >
                          <MemoBlueLeftArrow />
                          <span>Back</span>
                        </ClearButton>
                      </div>
                    </div>
                    <div className="navCloseContainer">
                      <IconButton
                        onClick={() => {
                          setMobileNavOpenDelay(false);
                          setTimeout(() => {
                            setMobileNavOpen(false);
                            setSubnavOpen(false);
                          }, 400);
                        }}
                        data-tooltip-id="navCloseTooltip"
                        data-tooltip-content="Close Menu"
                        icon={<MemoClear />}
                      />
                    </div>
                  </div>
                  <MobileNavItemsLazy
                    setMobileNavOpen={setMobileNavOpen}
                    setMobileNavOpenDelay={setMobileNavOpenDelay}
                    subnavOpen={subnavOpen}
                    subnavType={subnavType}
                    setSubnavType={setSubnavType}
                    setSubnavOpen={setSubnavOpen}
                    navItems={navItems}
                    isAdmin={isAdmin}
                    adminNavItems={adminItems}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {width > 991 && profileOpenDelay && (
        <ProfileSidebarComponent open={profileOpen} setOpen={setProfileOpen} />
      )}
    </div>
  );
}
