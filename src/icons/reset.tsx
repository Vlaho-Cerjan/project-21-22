import * as React from 'react';

function Reset(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.5 6H12a7.5 7.5 0 11-6.666 4.06" />
        <path d="M11.5 3l-3 3 3 3" />
      </g>
    </svg>
  );
}

const MemoReset = React.memo(Reset);
export default MemoReset;
