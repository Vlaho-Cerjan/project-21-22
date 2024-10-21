import * as React from 'react';

function CheckmarkCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx={12} cy={12} r={9.004} />
        <path d="M8.443 12.34l2.167 2.167-.014-.014 4.891-4.891" />
      </g>
    </svg>
  );
}

const MemoCheckmarkCircle = React.memo(CheckmarkCircle);
export default MemoCheckmarkCircle;
