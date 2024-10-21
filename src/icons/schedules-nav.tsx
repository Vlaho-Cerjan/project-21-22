import * as React from 'react';

function SchedulesNav(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 21" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.003 16.007l4.907.037M10.005 12.005h5.002M19.009 8.004H1M6.003 1.501v3.001M14.007 1.501v3.001" />
        <path
          clipRule="evenodd"
          d="M16.008 20.009H4.002a3.001 3.001 0 01-3-3.002V6.004a3.001 3.001 0 013-3.001h12.006a3.001 3.001 0 013 3v11.006a3.001 3.001 0 01-3 3z"
        />
      </g>
    </svg>
  );
}

const MemoSchedulesNav = React.memo(SchedulesNav);
export default MemoSchedulesNav;
