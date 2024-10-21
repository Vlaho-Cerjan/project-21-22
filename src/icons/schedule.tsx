import * as React from 'react';

function Schedule(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21H6a3 3 0 01-3-3V7.5a3 3 0 013-3h12a3 3 0 013 3V13M7.5 3v3M16.5 3v3M7 10h10M20 17.5L17.5 20 16 18.5" />
      </g>
    </svg>
  );
}

const MemoSchedule = React.memo(Schedule);
export default MemoSchedule;
