import * as React from 'react';

function ClockCross(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 13h-4V7M12 21a9 9 0 119-9M21 21l-4-4M21 17l-4 4" />
      </g>
    </svg>
  );
}

const MemoClockCross = React.memo(ClockCross);
export default MemoClockCross;
