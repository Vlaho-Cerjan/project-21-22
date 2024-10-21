import * as React from 'react';

function BlueLeftArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g
        stroke="#007DFF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 9H15M8.25 5.25L4.5 9M8.25 12.75L4.5 9" />
      </g>
    </svg>
  );
}

const MemoBlueLeftArrow = React.memo(BlueLeftArrow);
export default MemoBlueLeftArrow;
