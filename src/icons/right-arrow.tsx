import * as React from 'react';

function RightArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" {...props}>
      <g
        className="path"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <path d="M26.667 28.333L35 20l-8.333-8.333" strokeLinejoin="round" />
        <path d="M33.333 20H5" />
      </g>
    </svg>
  );
}

const MemoRightArrow = React.memo(RightArrow);
export default MemoRightArrow;
