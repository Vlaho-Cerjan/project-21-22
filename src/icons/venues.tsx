import * as React from 'react';

function Venues(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 19H4" />
        <path
          clipRule="evenodd"
          d="M4.309 8.51l1.628-2.578A2 2 0 017.628 5h8.744a2 2 0 011.69.932l1.63 2.579A2 2 0 0120 9.579V12a1 1 0 01-1 1H5a1 1 0 01-1-1V9.579a2 2 0 01.309-1.068z"
        />
        <path d="M5.927 19v-6M18 19v-6M10 19v-5.988M19.914 9H4.086" />
      </g>
    </svg>
  );
}

const MemoVenues = React.memo(Venues);
export default MemoVenues;
