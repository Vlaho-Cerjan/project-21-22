import * as React from 'react';

function ScheduleCross(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 21H6a3 3 0 01-3-3V7.5a3 3 0 013-3h12a3 3 0 013 3V13M19.5 16.5l-3 3M16.5 16.5l3 3M7.5 3v3M16.5 3v3M7 10h10" />
      </g>
    </svg>
  );
}

const MemoScheduleCross = React.memo(ScheduleCross);
export default MemoScheduleCross;
