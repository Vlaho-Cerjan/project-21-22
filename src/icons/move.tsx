import * as React from 'react';

function Move(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.508 16.031h1.5a2.5 2.5 0 002.5-2.5v-7a2.5 2.5 0 00-2.5-2.5h-11a2.5 2.5 0 00-2.5 2.5v1.5" />
        <rect x={2.508} y={8.031} width={15} height={12} rx={2.5} />
        <path d="M8.508 15.531l3-3M11.508 15.531v-3M8.508 12.531h3" />
      </g>
    </svg>
  );
}

const MemoMove = React.memo(Move);
export default MemoMove;
