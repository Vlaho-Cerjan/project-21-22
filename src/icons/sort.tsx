import * as React from 'react';

function Sort(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path className="desc" d="M14 8l3-3 3 3M17 19V5" stroke="#323234" />
        <path className="asc" d="M10 16l-3 3-3-3M7 5v14" stroke="#CFCFCF" />
      </g>
    </svg>
  );
}

const MemoSort = React.memo(Sort);
export default MemoSort;
