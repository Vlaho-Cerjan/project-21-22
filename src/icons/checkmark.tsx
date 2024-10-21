import * as React from 'react';

function Checkmark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...props}>
      <g
        className="path"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.99 11.792l3 3 8-8M16.026 4.756a8.995 8.995 0 104.913 7.087" />
      </g>
    </svg>
  );
}

const MemoCheckmark = React.memo(Checkmark);
export default MemoCheckmark;
