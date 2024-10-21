import * as React from 'react';

function CircleMinus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g stroke="#323234" strokeLinecap="round">
        <path
          d="M3 12.082C3 17.01 7.027 21 12 21v0c4.973 0 9-3.99 9-8.918v-.165C21 6.992 16.973 3 12 3v0c-4.973 0-9 3.99-9 8.918"
          strokeWidth={1.447}
          strokeLinejoin="round"
        />
        <path d="M10 12h3.918" strokeWidth={1.5} />
      </g>
    </svg>
  );
}

const MemoCircleMinus = React.memo(CircleMinus);
export default MemoCircleMinus;
