import * as React from 'react';

function Back(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        className="path"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <path d="M8 7l-5 5 5 5" strokeLinejoin="round" />
        <path d="M4 12h17" />
      </g>
    </svg>
  );
}

const MemoBack = React.memo(Back);
export default MemoBack;
