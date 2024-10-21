import * as React from 'react';

function CheckRectangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.5 12h5M12 14.5v-5" />
        <rect x={5} y={5} width={14} height={14} rx={4} />
      </g>
    </svg>
  );
}

const MemoCheckRectangle = React.memo(CheckRectangle);
export default MemoCheckRectangle;
