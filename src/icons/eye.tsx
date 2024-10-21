import * as React from 'react';

function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.122 9.88a3.004 3.004 0 010 4.245 3.004 3.004 0 01-4.245 0 3.004 3.004 0 010-4.245 3 3 0 014.245 0" />
        <path
          clipRule="evenodd"
          d="M3 12c0-.659.152-1.311.446-1.912v0C4.961 6.991 8.309 5 12 5s7.039 1.991 8.554 5.088v0c.294.601.446 1.253.446 1.912s-.152 1.311-.446 1.912v0C19.039 17.009 15.691 19 12 19s-7.039-1.991-8.554-5.088v0A4.346 4.346 0 013 12z"
        />
      </g>
    </svg>
  );
}

const MemoEye = React.memo(Eye);
export default MemoEye;
