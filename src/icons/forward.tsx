import * as React from 'react';

function Forward(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g className="path" stroke="#fff" strokeWidth={1.5} strokeLinecap="round">
        <path d="M16 17l5-5-5-5" strokeLinejoin="round" />
        <path d="M20 12H3" />
      </g>
    </svg>
  );
}

const MemoForward = React.memo(Forward);
export default MemoForward;
