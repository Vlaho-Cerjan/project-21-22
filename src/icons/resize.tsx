import * as React from 'react';

function Resize(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.294v6M9 5.294l3-3 3 3M12 22.294v-6M15 19.294l-3 3-3-3M17 17.294h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2M7 17.294H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
      </g>
    </svg>
  );
}

const MemoResize = React.memo(Resize);
export default MemoResize;
