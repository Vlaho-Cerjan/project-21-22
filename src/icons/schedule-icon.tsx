import * as React from 'react';

function ScheduleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 21" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.998 16.002l4.907.037M10 12h5.002M19.004 7.999H.996M5.998 1.496v3.001M14.002 1.496v3.001" />
        <path
          clipRule="evenodd"
          d="M16.003 20.004H3.997a3.001 3.001 0 01-3-3.002V5.999a3.001 3.001 0 013-3.001h12.006a3.001 3.001 0 013 3.001v11.005a3.001 3.001 0 01-3 3z"
        />
      </g>
    </svg>
  );
}

const MemoScheduleIcon = React.memo(ScheduleIcon);
export default MemoScheduleIcon;
