import * as React from 'react';

function ManagedNav(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M9 4.123V6M7.124 8.25v-1.5a.75.75 0 01.75-.751h2.252a.75.75 0 01.75.75v1.5M5.249 15.003V9a.75.75 0 01.75-.75h4.877M7.124 10.5H9.75M7.124 12.752H9"
          stroke="#4C4C70"
        />
        <path
          d="M8.25 15.002H5.248a3.001 3.001 0 01-3-3V4.497a3.001 3.001 0 013-3.001h7.503a3.001 3.001 0 013.002 3.001V7.5"
          stroke="#323232"
        />
        <path
          clipRule="evenodd"
          d="M16.128 16.503H11.25a.375.375 0 01-.375-.375v-.305a1.576 1.576 0 011.57-1.57h2.486a1.576 1.576 0 011.571 1.57v.305a.375.375 0 01-.375.375zM13.69 12.377a1.5 1.5 0 11.005 0h-.005z"
          stroke="#323232"
        />
      </g>
    </svg>
  );
}

const MemoManagedNav = React.memo(ManagedNav);
export default MemoManagedNav;
