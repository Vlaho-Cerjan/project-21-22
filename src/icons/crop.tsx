import * as React from 'react';

function Crop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 17.647H9a2 2 0 01-2-2v-12M17 21.647v-4" />
        <path d="M11 7.647h4a2 2 0 012 2v4M3 7.647h4" />
      </g>
    </svg>
  );
}

const MemoCrop = React.memo(Crop);
export default MemoCrop;
