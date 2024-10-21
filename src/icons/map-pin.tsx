import * as React from 'react';

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 8v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h2M4 5l15 15M4.465 19.535L11.5 12.5M16.5 9V6" />
        <circle cx={16.5} cy={3.5} r={2.5} />
      </g>
    </svg>
  );
}

const MemoMapPin = React.memo(MapPin);
export default MemoMapPin;
