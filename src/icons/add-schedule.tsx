import * as React from 'react';

function AddSchedule(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5.003 16.002l4.907.037M10.005 12h5.002M19.009 7.999H1.001M6.004 1.496v3.001M14.007 1.496v3.001"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        clipRule="evenodd"
        d="M16.008 20.004H4.003A3.001 3.001 0 011 17.002V5.999a3.001 3.001 0 013.002-3.001h12.005a3.001 3.001 0 013.001 3v11.006a3.001 3.001 0 01-3.001 3z"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.005 23a5 5 0 01-5-5c0-2.704 2.3-5.003 5.004-5a5 5 0 01-.004 10z"
        fill="#fff"
      />
      <path
        d="M18.005 23a5 5 0 01-5-5c0-2.704 2.3-5.003 5.004-5a5 5 0 01-.004 10"
        stroke="#323234"
        strokeWidth={1.5}
      />
      <path
        d="M18.005 16v4M20.005 18h-4"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoAddSchedule = React.memo(AddSchedule);
export default MemoAddSchedule;
