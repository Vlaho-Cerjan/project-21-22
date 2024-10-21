import * as React from 'react';

function GlobePin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.514 15.03H6a2 2 0 002-2v-2a2 2 0 012-2h2a2 2 0 002-2V3.253M16.5 16.28a.25.25 0 11-.001.5.25.25 0 01.002-.5" />
        <path
          clipRule="evenodd"
          d="M13 16.53v0a3.5 3.5 0 013.5-3.5v0a3.5 3.5 0 013.5 3.5v0c0 1.66-1.857 3.438-2.866 4.28a1.03 1.03 0 01-1.27 0C14.857 19.968 13 18.19 13 16.53z"
        />
        <path d="M12 21.03a9 9 0 119-9M20 16.53v0a3.5 3.5 0 00-3.5-3.5v0a3.5 3.5 0 00-3.5 3.5v0" />
      </g>
    </svg>
  );
}

const MemoGlobePin = React.memo(GlobePin);
export default MemoGlobePin;
