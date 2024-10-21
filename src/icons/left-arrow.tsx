import * as React from 'react';

function LeftArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" {...props}>
      <g
        className="path"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <path d="M13.333 11.667L5 20l8.333 8.333" strokeLinejoin="round" />
        <path d="M6.667 20H35" />
      </g>
    </svg>
  );
}

const MemoLeftArrow = React.memo(LeftArrow);
export default MemoLeftArrow;
