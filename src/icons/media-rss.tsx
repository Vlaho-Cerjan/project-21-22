import * as React from 'react';

function MediaRSS(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.5 16H19a2.5 2.5 0 002.5-2.5v-7A2.5 2.5 0 0019 4H8a2.5 2.5 0 00-2.5 2.5V8" />
        <rect x={2.5} y={8} width={15} height={12} rx={2.5} />
        <path d="M8.5 15.5l3-3M11.5 15.5v-3M8.5 12.5h3" />
      </g>
    </svg>
  );
}

const MemoMediaRSS = React.memo(MediaRSS);
export default MemoMediaRSS;
