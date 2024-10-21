import * as React from 'react';

function ClockCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 20.938A8.173 8.173 0 0112 21a9 9 0 119-9c0 .334-.02.668-.062 1M20 17l-2.5 2.5L16 18" />
        <path d="M12.5 7v5.5H8" />
      </g>
    </svg>
  );
}

const MemoClockCheck = React.memo(ClockCheck);
export default MemoClockCheck;
