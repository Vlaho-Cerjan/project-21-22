import * as React from 'react';

function Web(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H6a3 3 0 01-3-3V6a3 3 0 013-3h12a3 3 0 013 3v6M3 9h18" />
        <path d="M11 5.995L10.995 6l.005.005.005-.005L11 5.995M8.5 5.995L8.495 6l.005.005L8.505 6 8.5 5.995M6 5.995L5.995 6 6 6.005 6.005 6 6 5.995" />
        <path d="M11 5.995L10.995 6l.005.005.005-.005L11 5.995M8.5 5.995L8.495 6l.005.005L8.505 6 8.5 5.995M6 5.995L5.995 6 6 6.005 6.005 6 6 5.995M15 15a3.002 3.002 0 00-3 3v0a3.002 3.002 0 003 3M18 21a3.002 3.002 0 003-3v0a3.002 3.002 0 00-3-3M15 18h3" />
      </g>
    </svg>
  );
}

const MemoWeb = React.memo(Web);
export default MemoWeb;
