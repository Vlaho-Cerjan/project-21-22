import * as React from 'react';

function Support(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18.364 5.636a9 9 0 010 12.728 9 9 0 110-12.728" />
        <path d="M15.536 8.464a5 5 0 11-7.071 7.072 5 5 0 017.07-7.072M8.46 15.54l-2.82 2.82M15.53 8.46l2.83-2.82M5.64 5.64l2.82 2.82M15.54 15.54l2.82 2.82" />
      </g>
    </svg>
  );
}

const MemoSupport = React.memo(Support);
export default MemoSupport;
