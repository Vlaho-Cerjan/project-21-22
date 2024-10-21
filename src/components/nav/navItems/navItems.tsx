import {usePathname} from 'next/navigation';
import React from 'react';

import MemoCloudDevice from '@/src/icons/cloud-device';
import MemoHome from '@/src/icons/home';
import MemoSupport from '@/src/icons/support';
import MemoUserRoles from '@/src/icons/user-roles';

import MemoAdmin from '@/src/icons/admin';
import StyledLink from '../../common/link/link';

export default function NavItems({
  isAdmin,
  adminItems,
  navItems,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  isAdmin: boolean;
  adminItems: React.JSX.Element;
  navItems: React.JSX.Element;
}) {
  const pathname = usePathname();
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
    const navNetwork = document.getElementById('navNetwork');
    const mainNavDropdown = navNetwork?.querySelector('.mainNavDropdown');
    const navAdmin = document.getElementById('adminNetwork');
    const adminNavDropdown = navAdmin?.querySelector('.mainNavDropdown');

    const hoverListener = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (navNetwork) {
        if (target !== navNetwork && !navNetwork.contains(target)) {
          navNetwork.classList.remove('active');
          navNetwork.querySelector('.navItem')?.classList.remove('active');
        } else {
          navNetwork.classList.add('active');
          navNetwork.querySelector('.navItem')?.classList.add('active');
        }
      }

      if (navAdmin) {
        if (target !== navAdmin && !navAdmin.contains(target)) {
          navAdmin.classList.remove('active');
          navAdmin.querySelector('.navItem')?.classList.remove('active');
        } else {
          navAdmin.classList.add('active');
          navAdmin.querySelector('.navItem')?.classList.add('active');
        }
      }
    };
    if (mainNavDropdown) {
      mainNavDropdown.removeAttribute('style');
    }

    if (adminNavDropdown) {
      adminNavDropdown.removeAttribute('style');
    }

    document.addEventListener('mouseover', hoverListener);
    return () => {
      document.removeEventListener('mouseover', hoverListener);
    };
  }, [isAdmin]);

  return (
    <div {...props}>
      <StyledLink href="/" className="navItem">
        <div>
          <MemoHome />
          <span>Home</span>
        </div>
      </StyledLink>
      {!isAdmin && (
        <div id="navNetwork" className="networkNavDropdownContainer">
          <div className="navItem navItemDropdownEl">
            <div>
              <MemoCloudDevice />
              <span>Resources</span>
            </div>
          </div>
          <div
            style={{
              pointerEvents: 'none',
              opacity: 0,
            }}
            className="mainNavDropdown desktop"
          >
            <div className="mainNavArrow" />
            <div className="mainNavDropdownContent">
              <div className="contentContainer">{navItems}</div>
            </div>
          </div>
        </div>
      )}
      {/*
      <StyledLink href="/orders" className="navItem">
        <div>
          <MemoGetOrder />
          <span>Orders</span>
        </div>
      </StyledLink>
      */}
      {/*
      <Link href="/account" className="navItem">
        <div>
          <MemoMembers />
          <span>Account</span>
        </div>
      </Link>
      */}
      <StyledLink href="/roles" className="navItem">
        <div>
          <MemoUserRoles />
          <span>Roles</span>
        </div>
      </StyledLink>
      <StyledLink href="/support" className="navItem">
        <div>
          <MemoSupport />
          <span>Support</span>
        </div>
      </StyledLink>
      {isAdmin && (
        <div id="adminNetwork" className="networkNavDropdownContainer">
          <div className="navItem navItemDropdownEl">
            <div>
              <MemoAdmin />
              <span>Admin</span>
            </div>
          </div>
          <div
            style={{
              pointerEvents: 'none',
              opacity: 0,
            }}
            className="mainNavDropdown desktop"
          >
            <div className="mainNavArrow" />
            <div className="mainNavDropdownContent">
              <div>{adminItems}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
