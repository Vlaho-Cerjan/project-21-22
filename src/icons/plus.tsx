import * as React from 'react';

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g stroke="#323234" strokeWidth={1.5} strokeLinecap="round">
        <path d="M9 1v16M1 9h16" />
      </g>
    </svg>
  );
}

const MemoPlus = React.memo(Plus);
export default MemoPlus;
